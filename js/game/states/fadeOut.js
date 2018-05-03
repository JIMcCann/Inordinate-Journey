/*  game/states/fadeOut
    A semi-smooth transition between states:
    the current state fades out,
    and then the new state begins instantaneously. */
define(['game/game', 'util/functional'], function (game, F) {
    game.state.add('fadeOut', {
        init: function (screenshot, newState) {
            this.screenshot = screenshot;
            this.newState = newState;
            this.otherArgs = F.arrayOf.apply(F, arguments).slice(2);
        },
        preload: function () {
            this.load.image('underlay', this.screenshot);
        },
        create: function () {
            this.underlay = this.add.image(0, 0, 'underlay');
            this.overlay = this.add.graphics(0, 0);
            this.maxTimeout = 3;
            this.timeout = 0;
            this.timeoutsLeft = 10;
        },
        update: function () {
            this.timeout++;
            if (this.timeout >= this.maxTimeout) {
                this.timeout = 0;
                this.timeoutsLeft--;
                if (this.timeoutsLeft <= 0) {
                    F.curry(this.state.start, this.newState,
                        true, false).apply(this.state, this.otherArgs);
                } else {
                    this.overlay.beginFill(0, 1/4);
                    this.overlay.drawRect(0, 0, this.game.width, this.game.height);
                    this.overlay.endFill();
                }
            }
        }
    });
    return function (newState) {
        F.curry(game.state.start, 'fadeOut',
            true, false, game.canvas.toDataURL(), newState).apply(
                game.state, F.arrayOf.apply(F, arguments).slice(1));
    };
});
