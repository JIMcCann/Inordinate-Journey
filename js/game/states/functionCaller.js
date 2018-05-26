/*  game/states/functionCaller
    Literally all it does is call a function when it's loaded.
    Generally speaking, that function should bring us to another state. */
define(['game/game', 'util/functional'], function (game, F) {
    game.state.add('functionCaller', {
        init: function (f) {
            this.f = f;
            this.args = F.arrayOf.apply(F, arguments).slice(1);
        },
        update: function () {
            if (this.f) this.f.apply(this, this.args);
        }
    });
    return function (f) {
        F.curry(game.state.start, 'functionCaller', f).apply(
            game.state, F.arrayOf.apply(F, arguments).slice(1));
    };
});
