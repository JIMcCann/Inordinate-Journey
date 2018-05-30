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
            game.stage.backgroundColor = '#8B4513'; // dark brown background (might change this?)
            game.load.atlas('atlas', // load the sprite atlas
                assetPath + '/graphics/atlas.png',
                assetPath + '/graphics/atlas.json',
                Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            // had this removed game.load.image('tileset', assetPath + '/graphics/tileset.png'); // load the tileset
            game.load.audioSprite('audiosprite', // load the audiosprite
                [assetPath + '/audio/audiosprite.mp3',
                 assetPath + '/audio/audiosprite.ogg',
                 assetPath + '/audio/audiosprite.m4a',
                 assetPath + '/audio/audiosprite.ac3'],
                assetPath + '/audio/audiosprite.json');
        },
        create: function () {
            game.audiosprite = game.make.audioSprite('audiosprite');
        },
        update: function () {
            // as soon as the preload and create phases are done, jump to the next state
            // (given in init)
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
