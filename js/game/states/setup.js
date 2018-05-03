/*  game/states/setup
    Performs needed setup on the game instance.
    Globally loads the atlas, the tileset, and the audiosprite.
    Bryan, you don't have to worry about making the audiosprite.
    I found a program that will handle it if you just upload the audio files.
    The reason I want us to use an audiosprite is for coding convenience. */
let HAVE_ASSETS = false;
define(['game/game', 'util/functional'], function (game, F) {
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
            if (HAVE_ASSETS) {
                game.load.atlas('atlas', 'assets/graphics/atlas.png', 'assets/graphics/atlas.json',
                    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
                game.load.image('tileset', 'assets/graphics/tileset.png');
                game.load.audioSprite('audiosprite',
                    ['assets/audio/audiosprite.mp3',
                     'assets/audio/audiosprite.ogg',
                     'assets/audio/audiosprite.m4a'],
                    'assets/audio/audiosprite.json');
            }
        },
        create: function () {
            if (HAVE_ASSETS) {
                game.audiosprite = game.make.audioSprite('audiosprite');
                game.stage.addChild(game.audiosprite);
            }
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
