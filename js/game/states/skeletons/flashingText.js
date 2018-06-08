/*	game/states/skeletons/flashingText
	Draws some flashing red text at the top-left corner of the screen.
	The text knows on its own how to flash and go away. */
define({
	flashingText: function (str) {
		if (!this.game.hardMode) return;
		// add the text
		let text = this.add.text(60, 60, str, {
			fontSize: 18, fill: '#ff3333'
		});
		// use a coroutine to give the text higher level and more intuitive logic
		// than just using a game loop (could have done this for a lot of other things but oh well)
		let coroutine = (function* () {
			let timesToFlash = 7; // flash 7 times
			let delayBetweenFlash = 20; // 20 frames each
			for (let i = 0; i < timesToFlash; i++) { // loop for flashes themselves
				for (let j = 0; j < 2; j++) { // loop for transitions in visibility each flash
					text.visible = !text.visible; // toggle visibility
					for (let j = 0; j < delayBetweenFlash; j++) yield; // sleep the coroutine until delay elapsed
				}
			}
			text.destroy(); // destroy text when done flashing
			for (;;) yield; // sleep the coroutine forever to avoid errors from accidentally resuming it again
		})();
		text.update = function () {coroutine.next();};
	}
});
