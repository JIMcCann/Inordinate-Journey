/*  game/states/skelcomp: state skeleton compositor
    Takes arbitrarily many Phaser state definitions and smashes them together into one state. */
define(['game/game', 'util/functional'], function (game, F) {
    let statedef = {
        init: function () {
            this.initargs = F.arrayOf.apply(F, arguments);
            this.skels = [];
            for (let param of this.initargs) {
                let skel = param;
                let skelinitps = [];
                if (param instanceof Array) {
                    skel = param[0];
                    skelinitps = param.slice(1);
                }
                this.skels[this.skels.length] = skel;
                if (skel.init) skel.init.apply(this, skelinitps);
            }
        }
    };
    for (let f of ['preload', 'create', 'update']) F.using(statedef, function () {
        this[f] = function () {
            for (let skel of this.skels) if (skel[f]) skel[f].call(this);
        }
    });
    game.state.add('skelcomp', statedef);
    return function () {
        // Each argument should be either:
        // * a state skeleton, preferably loaded from a module rather than defined inline
        // * OR: an array containing a state skeleton and its init arguments
        F.curry(game.state.start, 'skelcomp', true, false).apply(
            game.state, F.arrayOf.apply(F, arguments));
    };
});
