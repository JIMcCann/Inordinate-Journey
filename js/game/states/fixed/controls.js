/*	game/states/fixed/controls
	Gives rundown of game controls */
define(['game/states/fixed/meta', 'game/states/functionCaller'],
function (meta) {
	return function (callback) {
		return (meta({
			text: "Arrowkeys or WASD to move and jump\n" +
				"Spacebar to advance slides and confirm selections\n" +
				"ESC to pause",
			textSize: 16,
			nextState: ['functionCaller', callback]
		}))();
	};
});
