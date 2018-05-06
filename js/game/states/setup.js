/*  game/states/setup
    Performs needed setup on the game instance.
    Globally loads the atlas, the tileset, and the audiosprite.
    Bryan, you don't have to worry about making the audiosprite.
    I found a program that will handle it if you just upload the audio files.
    The reason I want us to use an audiosprite is for coding convenience. */
define(['game/assetPath', 'game/game', 'util/functional'], function (assetPath, game, F) {
    game.state.add('setup', {
        init: function () {
            let args = F.arrayOf.apply(F, arguments);
            this.nextState = args[0];
            this.otherArgs = args.slice(1);
        },
        preload: function () {
            Phaser.Canvas.setSmoothingEnabled(game.context, false);
            game.time.advancedTiming = true;
            game.stage.backgroundColor = '#000000';
            game.load.atlas('atlas',
                assetPath + '/graphics/atlas.png',
                assetPath + '/graphics/atlas.json',
                Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            game.load.image('tileset', assetPath + '/graphics/tileset.png');
            game.load.audioSprite('audiosprite',
                [assetPath + '/audio/audiosprite.mp3',
                 assetPath + '/audio/audiosprite.ogg',
                 assetPath + '/audio/audiosprite.m4a'],
                assetPath + '/audio/audiosprite.json');
        },
        create: function () {
            game.audiosprite = game.make.audioSprite('audiosprite');
            game.stage.addChild(game.audiosprite);
        },
        update: function () {
            F.curry(game.state.start, this.nextState,
                true, false).apply(game.state, this.otherArgs);
        }
    });
    return function () {
        F.curry(game.state.start, 'setup',
            true, false).apply(game.state,
                F.arrayOf.apply(F, arguments));
    };
});
