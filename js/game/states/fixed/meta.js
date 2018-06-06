/*  game/states/fixed/meta
	Takes a spec argument for fixed.js
	and returns a function instantiating a fixed state with that spec argument.
	If no extra arguments are given to set nextState, the default behavior
	will be to call game/states/resumeGame. */
define(['game/states/fixed', 'game/states/resumeGame', 'util/functional'],
function (fixed, resumeGame, F) {
	return function (spec) {
		let nextState = F.arrayOf.apply(F, arguments).slice(1);
		if (nextState.length == 0) nextState = ['resumeGame'];
		return F.curry(F.curry, F.curry(fixed, spec)).apply(F, nextState); // lol "curry curry curry"
	}
});
