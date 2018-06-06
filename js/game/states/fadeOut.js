/*  game/states/fadeOut
	A semi-smooth transition between states:
	the current state fades out,
	and then the new state begins instantaneously. */
define(['game/game', 'util/functional'], function (game, F) {
	// The initialization phase for this module
	// adds the fadeOut state to the game. It's defined thus:
	game.state.add('fadeOut', {
		// Its init takes the URL of the image to display as a screenshot underlay,
		// the name of the state that should come after the fade-out,
		// and arbitrarily many extra arguments,
		// which are used for that next state's init.
		init: function (screenshot, newState) {
			this.screenshot = screenshot;
			this.newState = newState;
			this.otherArgs = F.arrayOf.apply(F, arguments).slice(2);
				// slice(2) to skip screenshot and newState
		},
		// Its preload loads the screenshot URL as a Phaser image.
		preload: function () {
			this.load.image('underlay', this.screenshot);
		},
		// Its create adds the screenshot to the world as an underlay
		// and a full-screen graphics object as an overlay.
		// It then initializes the timer to use to decide how fast to fade out.
		create: function () {
			this.game.audiosprite.stop();
			this.underlay = this.add.image(0, 0, 'underlay');
			this.overlay = this.add.graphics(0, 0);
			this.maxTimeout = 3;
			this.timeout = 0;
			this.timeoutsLeft = 10;
		},
		// Its update increments the timer.
		// Each time the timer reaches its designated limit,
		// another layer of fade-outiness is applied.
		update: function () {
			this.timeout++; // increment timer
			if (this.timeout >= this.maxTimeout) { // check if it's ready; if so:
				this.timeout = 0; // reset it for next time
				this.timeoutsLeft--; // one less time left
				if (this.timeoutsLeft <= 0) { // if no times left:
					// start the new state
					F.curry(this.state.start, this.newState,
						true, false).apply(this.state, this.otherArgs);
				} else { // if still times left:
					// draw another translucent black rectangle over the underlay
					this.overlay.beginFill(0, 1/4);
					this.overlay.drawRect(0, 0, this.game.width, this.game.height);
					this.overlay.endFill();
				}
			}
		}
	});
	// export a function that takes a screenshot of the current state,
	// stores it as a data URL, and uses it to start the fade-out state;
	// newState is the name of the state to go to after the fade-out,
	// and any extra arguments are forwarded to newState's init
	return function (newState) {
		F.curry(game.state.start, 'fadeOut',
			true, false, game.canvas.toDataURL(), newState).apply(
				game.state, F.arrayOf.apply(F, arguments).slice(1));
	};
});
