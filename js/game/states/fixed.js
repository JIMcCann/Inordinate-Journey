/*  game/states/fixed
	Game state representing a fixed "screen,"
	e.g. a title "screen" or a game-over "screen."
	It can:
	* display an image in the center of the screen
	* play and possibly loop an audio file
	* show text near the bottom of the screen (or in the middle if no image)
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
			// bugfix for mysterious problem
			this.image = undefined;
			this.audio = undefined;
			this.audioVolume = undefined;
			this.text = undefined;
			this.textSize = undefined;
			this.textColor = undefined;
			this.options = undefined;
			this.nextState = undefined;
			this.backgroundColor = undefined;
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
			if (!this.nextState) this.nextState = F.arrayOf.apply(F, arguments).slice(1);
			// some extra things added late in development
			this.backgroundColor = this.backgroundColor || '#000000';
			this.optionSelected = 0;
			// (if no extra arguments given, default to resetting this exact state ad infinitum)
			if (this.nextState == []) this.nextState = ['fixed', spec];
		},
		create: function () {
			game.stage.backgroundColor = this.backgroundColor;
			if (this.image) { // if we're displaying an image in the center of the screen:
				let i = this.add.image(0, 0, 'atlas', this.image); // make it
				i.x = (this.game.width - i.width)/2; // put it there
				i.y = (this.game.height - i.height)/2;
			}
			if (this.audio) // if we're playing audio:
				game.audiosprite.play(this.audio, this.audioVolume); // play the audio
			let textY = (this.game.height - this.textSize)*(this.image ? 3/4 : 1/2);
			if (this.options) {
				for (let i = 0; i < this.options.length; i++) {
					let row = this.options[i];
					//console.log('CREATING OPTION:', row);
					let t = this.add.text(0, 0, row.name, {
						fontSize: this.textSize*2/3, fill: '#888888'
					});
					let STATE = this;
					t.update = function () {
						//console.log(this.x, this.y);
						if (STATE.optionSelected == i) {
							this.text = row.name + '     <==';
							this.fill = '#ffffff';
						} else {
							this.text = row.name;
							this.fill = '#888888';
						}
					}
					t.x = (this.game.width - t.width)/2;
					if (this.optionSelected == i) t.text += '     <==';
					t.y = textY;
					if (t) textY += t.height*5/4;
				}
			}
			if (this.text) { // if we're showing text:
				if (this.text instanceof Function) this.text = this.text();
				let t = this.add.text(0, 0, this.text, {
					fontSize: this.textSize, fill: this.textColor
				}); // make it, using the other details given about the text
				t.x = (this.game.width - t.width)/2; // put it near the bottom of the screen
				t.y = textY;
			}
		},
		update: function () {
			if (this.options) {
				let selectionInfluence = 0;
				if (keyDown('down')) selectionInfluence = 1;
				if (keyDown('up')) selectionInfluence = -1;
				if (selectionInfluence != 0 && !this.inputStalling) {
					this.game.audiosprite.play('land');
					this.optionSelected += selectionInfluence;
					this.inputStalling = true;
				} else if (selectionInfluence == 0 && this.inputStalling)
					this.inputStalling = false;
				this.optionSelected = Math.max(0, Math.min(this.options.length - 1, this.optionSelected));
			}
			if (keyDown('spacebar')) { // if spacebar pressed:
				// get menu option if applicable
				if (this.options) {
					this.nextState = this.options[this.optionSelected].nextState;
					this.game.audiosprite.play('jump');
				}
				if (this.nextState instanceof Function)
					fadeOut.apply(this, this.nextState());
				else fadeOut.apply(this, this.nextState); // fade-out to the next state
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
