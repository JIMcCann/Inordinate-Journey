/*	game/states/skeletons/pause
	Adds Esc as a pause button. */
define(['game/game', 'game/states/fixed/titleScreen', 'game/states/fadeOut', 'game/states/functionCaller'],
function (game, titleScreen, fadeOut) {
	let keydownHandler = function (e) {
		switch (e.keyCode) {
			case 27: // escape
				if (game.paused) game.paused = false;
				else game.pauseQueued = true;
				break;
			case 82: case 114: // r
				if (game.paused) {
					game.paused = false;
					game.resetQueued = true;
				}
				break;
			case 81: case 113: // q
				if (game.paused) {
					game.paused = false;
					game.quitQueued = true;
				}
				break;
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
			if (this.pauseExplanation) {
				this.pauseExplanation.destroy();
				this.pauseExplanation = null;
			}
			if (game.pauseQueued) {
				game.pauseQueued = false;
				this.pauseText = this.add.text(0, 0, '(Paused)', {
					fontSize: 24, fill: '#ff0000'
				});
				this.pauseExplanation = this.add.text(0, 0, 'Esc: Resume\nR: Reset Level\n' +
						'Q: Save and Quit to Title', {
					fontSize: 16, fill: '#ff0000'
				});
				this.pauseText.x = (this.game.width - this.pauseText.width)/2;
				this.pauseText.y = (this.game.height - this.pauseText.height)/2 - 64;
				this.pauseExplanation.x = (this.game.width - this.pauseExplanation.width)/2;
				this.pauseExplanation.y = (this.game.height - this.pauseExplanation.height)/2 + 64;
				game.paused = true;
			}
			if (game.resetQueued) {
				game.resetQueued = false;
				this.game.levelOrder.restartLevel();
			}
			if (game.quitQueued) {
				game.quitQueued = false;
				fadeOut('functionCaller', titleScreen);
			}
		}
	};
});
