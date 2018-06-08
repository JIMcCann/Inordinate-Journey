/*	game/states/fixed/graderNote
	Hi there! This should show up in-game at the main menu.
	It has something you should read.
	(Or you could just read it here, I guess.) */
define(['game/states/fixed/meta', 'game/states/functionCaller'],
function (meta) {
	return function (callback) {
		return (meta({
			text: "To skip through levels, you can press P.\n" +
				"You can unlock Hard Mode by beating the game once.\n" +
				"Please be sure to check out Hard Mode as well as the main game,\n" +
				"as many features we're quite proud of were moved to Hard Mode\n" +
				"because they were so hard.\n" +
				"Thank you for all your help and hard work this quarter! :)",
			textSize: 16,
			nextState: ['functionCaller', callback]
		}))();
	};
});
