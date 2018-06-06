/*  game/states/functionCaller
	Literally all it does is call a function when it's loaded.
	Generally speaking, that function should bring us to another state. */
define(['game/game', 'util/functional'], function (game, F) {
	game.state.add('functionCaller', {
		// init
		// Store the function to call and the arguments to call it with
		// (those being all other arguments to init).
		init: function (f) {
			this.f = f;
			this.args = F.arrayOf.apply(F, arguments).slice(1);
		},
		// update
		// Immediately call the function.
		update: function () {
			if (this.f) this.f.apply(this, this.args);
		}
	});
	// The value of this module is a function that forwards its arguments
	// to the functionCaller state's init.
	return function (f) {
		F.curry(game.state.start, 'functionCaller', f).apply(
			game.state, F.arrayOf.apply(F, arguments).slice(1));
	};
});
