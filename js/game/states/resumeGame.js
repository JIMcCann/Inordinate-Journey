/*  game/states/resumeGame
	Upon starting this state with no parameters, e.g. from a fixed.js state,
	the LevelOrder interface will be used to start the current level instead. */
define(['game/game', 'game/states/skelcomp'], function (game) {
	game.state.add('resumeGame', {
		update: function () {
			game.levelOrder.restartLevel();
		}
	});
	return function () {
		game.state.start('resumeGame');
	}
});
