/*  game/keyDown
	Registers the keys we're interested in listening for
	and returns a function that checks if they're down
	as of the current frame. */
define(['game/game'], function (game) {
	// We care about the spacebar, the arrowkeys, and WSAD.
	let keyArr = ['spacebar', 'up', 'down', 'left', 'right', 'w', 's', 'a', 'd'];
	// But we haven't loaded them yet, so the keys object itself is empty.
	let keys = {};
	// Here we define equivalencies between arrowkeys and WSAD.
	let equivmap = {
		up: 'w', down: 's', left: 'a', right: 'd',
		w: 'up', s: 'down', a: 'left', d: 'right'
	};
	// Here's the function we're exporting.
	// It takes the name of a key, as defined in keyArr,
	// and returns a truthy value if and only if that key or its equivalency is down.
	let keyDown = function (key) {
		// It also performs initialization of the actual keys object
		// by requesting handlers for said keys.
		// This initialization is of course only performed once.
		// game.input is checked because for some reason I was getting this weird error
		// where about half the time I started the game,
		// game.input would be undefined for the first few frames,
		// and any calls to keyDown would error out for that reason.
		if (game.input && !keyDown.initialized) {
			// This for loop just loops through the array of keys we want
			// and, for each such key, tells Phaser we want it
			// and stores the resulting input handler
			// in the 'keys' object.
			for (let k of keyArr) {
				keys[k] = game.input.keyboard.addKey(Phaser.KeyCode[k.toUpperCase()]);
			}
			// Then it records the fact that it initialized the 'keys' object
			// so we don't have to do it again.
			keyDown.initialized = true;
		}
		// After making sure we're initialized,
		// we check BOTH the key actually queried AND its equivalency if applicable,
		// and return true if either of them are down.
		for (let k of [key, equivmap[key]])
			if (k && keys[k] && keys[k].isDown)
				return true;
		// Otherwise we return false.
		return false;
	};
	// This return statement reminds requirejs
	// that keyDown is what we're exporting as the value of this module.
	return keyDown;
});
