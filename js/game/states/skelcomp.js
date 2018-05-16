/*  game/states/skelcomp: state skeleton compositor
    Takes arbitrarily many Phaser state definitions and smashes them together into one state. */
define(['game/game', 'util/functional'], function (game, F) {
    let statedef = {
        eachSkel: function (k, args) {
            let retval = [];
            for (let skel of this.skels) if (skel[k]) { // For each skeleton that supports the method:
                let r = skel[k].apply(this, args); // Call it
                if (r) retval[retval.length] = r; // Add it to return value if it returned anything
            }
            switch (retval.length) {
                case 0: return undefined; // Return nothing if nothing returned anything
                case 1: return retval[0]; // Return the only result if there was only one
                default: return retval; // Otherwise return the whole array
            }
        },
        updateMethods: function () {
            // Catalog all the methods we have on all our skeletons.
            let self = this;
            let skelMeths = {};
            let protectedMeths = ['init', 'preload', 'create', 'update', 'render'];
            for (let skel of this.skels)
                for (let k in skel)
                    if (!protectedMeths.includes(k))
                        skelMeths[k] = true;
            // Put them all on the compositor.
            for (let k in skelMeths) if (!this[k])
                this[k] = function () {
                    self.eachSkel(k, arguments);
                };
        },
        init: function () {
            this.initargs = F.arrayOf.apply(F, arguments);
            this.skels = []; // we need to figure out what skeletons we have
            let skelinitps = [];

            for (let param of this.initargs) { // for each argument given to init:
                let skel = param; // assume the argument is a skeleton
                let thisskelinitps = []; // with no init arguments
                if (param instanceof Array) { // BUT, if the argument is an array:
                    skel = param[0]; // then it's NOT a skeleton, its first element is
                    thisskelinitps = param.slice(1); // and the rest is init arguments to that skeleton
                }

                // once we've figured out what the skeleton is,
                this.skels[this.skels.length] = skel; // add it to what skeletons we have
                skelinitps[skelinitps.length] = thisskelinitps; // and add the init parameters
            }

            // add the rest of the state functions to the skeleton compositor
            this.updateMethods();

            // finally do all skeletons' inits
            for (let i = 0; i < this.skels.length; i++)
                if (this.skels[i].init)
                    this.skels[i].init.apply(this, skelinitps[i]);
        },
        preload: function () {this.eachSkel('preload');},
        create: function () {this.eachSkel('create');},
        update: function () {this.eachSkel('update');},
        render: function () {this.eachSkel('render');},
        // addSkel()
        // Add a skeleton to the compositor, and then run the skeleton's
        // init, preload, and create, in that order.
        // This function is intended for extending the functionality of the state
        // after the state has already been switched to,
        // e.g. you could use this to make the player come out of the portal.
        // The first argument should be the skeleton itself.
        // Any additional arguments are treated as init parameters for the skeleton.
        addSkel: function (skel) {
            let skelinitps = F.arrayOf.apply(F, arguments).slice(1);
            this.skels[this.skels.length] = skel;
            this.updateMethods();
            if (skel.init) skel.init.apply(this, skelinitps);
            if (skel.preload) skel.preload.call(this);
            if (skel.create) skel.create.call(this);
        }
    };
    // add the SSC to the game
    game.state.add('skelcomp', statedef);
    // export a function that forwards all its arguments to skelcomp's init
    // while starting skelcomp
    return function () {
        // Each argument should be either:
        // * a state skeleton, preferably loaded from a module rather than defined inline
        // * OR: an array containing a state skeleton and its init arguments
        F.curry(game.state.start, 'skelcomp', true, false).apply(
            game.state, F.arrayOf.apply(F, arguments));
    };
});
