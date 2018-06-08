/*	game/states/fixed/credits
	Shows credits slide */
define(['game/states/fixed/meta', 'game/states/functionCaller'],
function (meta) {
	return function (callback) {
		return (meta({
			text: "Art by Concio Garcia.\nSound by Soularflair. Picked out by Bryan Arvizu.\n" +
				"Code by Bryan Arvizu, Concio Garcia, and Jaime McCann.\nThanks for playing!",
			textSize: 16,
			nextState: ['functionCaller', callback]
		}))();
	};
});
