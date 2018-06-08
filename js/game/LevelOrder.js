/*  game/LevelOrder
	Keeps track of what level we're on and handles switching. */
define(['game/states/fadeOut',
		'game/states/skeletons/groups', 'game/states/skeletons/player',
		'game/states/skeletons/pause',
		'game/states/fixed/finalScore', 'game/states/functionCaller'],
function (fadeOut, groupsSkel, playerSkel, pauseSkel, finalScore) {return {
	order: [],
	current: 0,
	// nextLevel: Construct and transition to a state for the next level.
	nextLevel: function () {
		this.current += 1;
		if (localStorage) localStorage.setItem('currentLevel', this.current);
		if (this.current >= this.order.length) {
			this.current = 0;
			fadeOut('functionCaller', finalScore);
		} else fadeOut('skelcomp', groupsSkel, playerSkel, pauseSkel, this.order[this.current]);
			// start the SSC with the proper skeletons (groups, player, and particular level)
	},
	// restartLevel: Go to the next level without actually going to the next level.
	//		Just go to the current level instead.
	restartLevel: function () {
		this.current--;
		this.nextLevel();
	}
};});
