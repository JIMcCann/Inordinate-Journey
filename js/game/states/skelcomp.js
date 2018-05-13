/*  game/states/skelcomp: state skeleton compositor
    Takes arbitrarily many Phaser state definitions and smashes them together into one state. */
define(['game/game', 'util/functional'], function (game, F) {
    let statedef = {
        init: function () {
            this.initargs = F.arrayOf.apply(F, arguments);
            this.skels = []; // we need to figure out what skeletons we have
            for (let param of this.initargs) { // for each argument given to init:
                let skel = param; // assume the argument is a skeleton
                let skelinitps = []; // with no init arguments
                if (param instanceof Array) { // BUT, if the argument is an array:
                    skel = param[0]; // then it's NOT a skeleton, its first element is
                    skelinitps = param.slice(1); // and the rest is init arguments to that skeleton
                }
                // once we've figured out what the skeleton is,
                this.skels[this.skels.length] = skel; // add it to what skeletons we have
                if (skel.init) skel.init.apply(this, skelinitps); // and do its init
            }
        }
    };
    // add the rest of the state functions to the skeleton compositor
    for (let f of ['preload', 'create', 'update']) F.using(statedef, function () {
        this[f] = function () {
            // each such function should just call all the skeletons' corresponding functions
            for (let skel of this.skels) if (skel[f]) skel[f].call(this);
        }
    });
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
