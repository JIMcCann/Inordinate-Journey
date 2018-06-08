/*  game/states/setup
	Performs needed setup on the game instance.
	Globally loads the atlas, the tileset, and the audiosprite.
	Bryan, you don't have to worry about making the audiosprite.
	I found a program that will handle it if you just upload the audio files.
	The reason I want us to use an audiosprite is for coding convenience. */
define(['game/assetPath', 'game/game', 'game/LevelOrder', 'util/functional'], function (assetPath, game, LevelOrder, F) {
	game.state.add('setup', {
		init: function () {
			let args = F.arrayOf.apply(F, arguments);
			this.nextState = args[0]; // the starting state of the game should be the first argument
			this.otherArgs = args.slice(1); // other arguments will be forwarded to said state
			game.levelOrder = LevelOrder; // avoids circular dependency
		},
		preload: function () {
			Phaser.Canvas.setSmoothingEnabled(game.context, false); // no smooth scaling thanks
			game.time.advancedTiming = true; // in case we need the FPS for anything
			game.stage.backgroundColor = '#000000';
			game.load.atlas('atlas', // load the sprite atlas
				assetPath + '/graphics/atlas.png',
				assetPath + '/graphics/atlas.json',
				Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
			try {
				game.load.audioSprite('audiosprite', // load the audiosprite
					[assetPath + '/audio/audiosprite.mp3',
					 assetPath + '/audio/audiosprite.ogg',
					 assetPath + '/audio/audiosprite.m4a',
					 assetPath + '/audio/audiosprite.ac3'],
					 assetPath + '/audio/audiosprite.json');
			} catch (e) {} // don't worry if there's no audiosprite
		},
		create: function () {
			try {
				game.audiosprite = game.make.audioSprite('audiosprite'); // try to make audiosprite object
			} catch (e) {
				game.audiosprite = { // if there is none, create a dummy to avoid errors
					play: function () {},
					stop: function () {}
				};
			}
			let t = game.add.text(0, 0, 'Decoding game audio.\nPlease wait...', {
				fontSize: 16, fill: '#ffffff'
			});
			let coroutine = (function* () {
				for (;;) {
					for (let i = 0; i < 30; i++) yield;
					t.text += '.';
				}
			})();
			t.update = function () {coroutine.next();};
			t.x = (game.width - t.width)/2;
			t.y = (game.height - t.height)/2;
		},
		update: function () {
			if (game.cache.isSoundReady('audiosprite'))
				F.curry(game.state.start, this.nextState,
					true, false).apply(game.state, this.otherArgs);
		}
	});
	// export a function that simply forwards all its arguments to the setup state's init
	// while starting the setup state
	return function () {
		F.curry(game.state.start, 'setup',
			true, false).apply(game.state,
				F.arrayOf.apply(F, arguments));
	};
});
