/*	game/states/skeletons/pause
	Adds Esc as a pause button. */
define(['game/game'], function (game) {
	let keydownHandler = function (e) {
		if (e.keyCode == 27) {
			if (game.paused) game.paused = false;
			else game.pauseQueued = true;
		}
	};
	if (document.addEventListener) {
		document.addEventListener('keydown', keydownHandler, false);
	} else if (document.attachEvent) {
		document.attachEvent('onkeydown', keydownHandler);
	}
	return {
		update: function () {
			if (this.pauseText) {
				this.pauseText.destroy();
				this.pauseText = null;
			}
			if (game.pauseQueued) {
				this.pauseText = this.add.text(0, 0, '(Paused)', {
					fontSize: 24, fill: '#ff0000'
				});
				this.pauseText.x = (this.game.width - this.pauseText.width)/2;
				this.pauseText.y = (this.game.height - this.pauseText.height)/2;
				game.pauseQueued = false;
				game.paused = true;
			}
		}
	};
});
