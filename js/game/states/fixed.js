/*  game/states/fixed
    Game state representing a fixed "screen,"
    e.g. a title "screen" or a game-over "screen."
    It can:
    * display an image in the center of the screen
    * play and possibly loop an audio file
    * show text near the bottom of the screen
    * go to another state when you press space */
define(['game/game', 'game/keyDown', 'game/states/fadeOut', 'util/functional'],
function (game, keyDown, fadeOut, F) {
    game.state.add('fixed', {
        init: function (spec) {
            /*  valid keys for spec:
                * image: a key into the loaded texture atlas
                * audio: a key into the loaded audiosprite
                    * audioVolume: the volume to play the audio at (0-1)
                * text: text to show at the bottom of the screen
                    * textSize: font size in pt
                    * textColor: HTML code for text color (starting with #) */
            for (let prop in spec) this[prop] = spec[prop];
            this.audioVolume = this.audioVolume || 0.6;
            this.textSize = this.textSize || 12;
            this.textColor = this.textColor || '#ffffff';
            this.nextState = F.arrayOf.apply(F, arguments).slice(1);
            if (this.nextState.length == 0) this.nextState = ['fixed', spec];
        },
        create: function () {
            if (this.image) {
                let i = this.add.image(0, 0, 'atlas', this.image);
                i.x = (this.game.width - i.width)/2;
                i.y = (this.game.height - i.height)/2;
            }
            if (this.audio)
                game.audiosprite.play(this.audio, this.audioVolume);
            if (this.text) {
                let t = this.add.text(0, 0, this.text, {
                    fontSize: this.textSize, fill: this.textColor
                });
                t.x = (this.game.width - t.width)/2;
                t.y = (this.game.height - t.height)*3/4;
            }
        },
        update: function () {
            if (keyDown('spacebar')) {
                if (this.bgm) this.bgm.mute = true;
                fadeOut.apply(this, this.nextState);
            }
        }
    });
    return function () {
        F.curry(game.state.start, 'fixed', true, false).apply(
            game.state, F.arrayOf.apply(F, arguments));
    }
});
