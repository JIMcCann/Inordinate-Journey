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
            // give the state all the same properties as the spec
            // (but keep any existing properties of the state)
            for (let prop in spec) this[prop] = spec[prop];
            // if no audioVolume was given, default to 0.6
            this.audioVolume = this.audioVolume || 0.6;
            // if no textSize was given, default to 12 pt font (is this really desirable?)
            this.textSize = this.textSize || 12;
            // if no textColor was given, default to white
            this.textColor = this.textColor || '#ffffff';
            // use extra arguments BESIDES spec to decide what state to transition to
            // after pressing space
            this.nextState = F.arrayOf.apply(F, arguments).slice(1);
            // (if no extra arguments given, default to resetting this exact state ad infinitum)
            if (this.nextState.length == 0) this.nextState = ['fixed', spec];
        },
        create: function () {
            if (this.image) { // if we're displaying an image in the center of the screen:
                let i = this.add.image(0, 0, 'atlas', this.image); // make it
                i.x = (this.game.width - i.width)/2; // put it there
                i.y = (this.game.height - i.height)/2;
            }
            if (this.audio) // if we're playing audio:
                game.audiosprite.play(this.audio, this.audioVolume); // play the audio
            if (this.text) { // if we're showing text:
                let t = this.add.text(0, 0, this.text, {
                    fontSize: this.textSize, fill: this.textColor
                }); // make it, using the other details given about the text
                t.x = (this.game.width - t.width)/2; // put it near the bottom of the screen
                t.y = (this.game.height - t.height)*3/4;
            }
        },
        update: function () {
            if (keyDown('spacebar')) { // if spacebar pressed:
                if (this.bgm) this.bgm.mute = true; // stop audio if applicable
                fadeOut.apply(this, this.nextState); // fade-out to the next state
            }
        }
    });
    // export a function that takes init arguments for the state
    // (meaning the spec and the next state)
    // and starts the state
    return function () {
        F.curry(game.state.start, 'fixed', true, false).apply(
            game.state, F.arrayOf.apply(F, arguments));
    }
});
