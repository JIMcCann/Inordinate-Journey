/*  game/LevelOrder
	Keeps track of what level we're on and handles switching. */
define(['game/states/fadeOut',
		'game/states/skeletons/groups', 'game/states/skeletons/player'],
function (fadeOut, groupsSkel, playerSkel) {return {
	order: [],
	current: 0,
	// nextLevel: Construct and transition to a state for the next level.
	nextLevel: function () {
		this.current += 1;
		if (this.current >= this.order.length) this.current = 0;
			// loop back to beginning if we finish the game
			// (not necessarily the most desirable behavior but nothing that makes more sense really)
		fadeOut('skelcomp', groupsSkel, playerSkel, this.order[this.current]);
			// start the SSC with the proper skeletons (groups, player, and particular level)
	},
	// restartLevel: Go to the next level without actually going to the next level.
	//		Just go to the current level instead.
	restartLevel: function () {
		this.current--;
		this.nextLevel();
	}
};});
