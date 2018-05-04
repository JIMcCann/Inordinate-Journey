// All assets are my own work. I'm kind of proud of them.

// I don't like the word "var," so I have this weird way of doing things now where I use a lot of functions.

// This anonymous function takes the object defining all the kinds of states, and uses it to instantiate the game.
(function (endlessRunner) {
    // It then initializes the instantiated game by calling this other anonymous function on it.
    (function (game) {
        // Add states and pick initial state (title screen)
        game.state.add('titleScreen', endlessRunner.titleScreen);
        game.state.add('run', endlessRunner.run);
        game.state.add('gameOver', endlessRunner.gameOver);
        game.state.start('titleScreen');
    })(new Phaser.Game(800, 600, Phaser.CANVAS));
})({
    // This is the aforementioned "object defining all the kinds of states."
    // Each state is defined by calling an anonymous function that takes a state constructor (which will generally
    // just be "function (game) {}") and sticks a prototype on it.
    // Here is the title screen state definition.
    titleScreen: (function (constructor) {
        constructor.prototype = {
            preload: function () {
                // preload: Load texture atlas.
                Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
                this.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json',
                    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            }, create: function () {
                // create: Extract title screen graphic from texture atlas.
                this.game.stage.backgroundColor = '#000000';
                (function (titleScreenSprite) {
                    titleScreenSprite.scale.setTo(2, 2); // I made my graphics tiny so now they must be big.
                    titleScreenSprite.animations.add('idle', ['titlescreen']);
                    titleScreenSprite.animations.play('idle');
                })(this.add.sprite(this.game.width/2 - 256, this.game.height/2 - 256, 'atlas'));
                // Prepare to listen for spacebar.
                this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                // Tell the user we're listening for the spacebar.
                this.pressSpace = this.add.text(16, this.game.height - 32, 'Press Space', {
                    fontSize: '24px', fill: '#fff'
                })
            }, update: function () {
                // If the spacebar gets pressed (or, rather, has been pressed in the last "frame," i.e. sixtieth of
                // a second), go to the "run" game state, defined below.
                if (this.spacebar.downDuration(1000/60))
                    this.state.start('run');
            }
        };
        return constructor;
    })(function (game) {}),
    // Here is the run state definition.
    run: (function (constructor) {
        constructor.prototype = {
            preload: function () {
                // preload: Load texture atlas and BGM.
                Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
                this.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json',
                    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
                this.load.audio('bgm', ['assets/audio/bgm.ogg']);
                this.load.audio('jumpse', ['assets/audio/jumpse.ogg']);
                this.load.audio('tfse', ['assets/audio/tfse.ogg']);
                this.load.audio('diese', ['assets/audio/diese.ogg']);
                this.game.time.advancedTiming = true;
            }, create: function () {
                this.game.time.desiredFps = 40;
                // create: Play BGM.
                this.game.stage.backgroundColor = '#000000';
                this.bgm = this.add.audio('bgm');
                this.jumpse = this.add.audio('jumpse');
                this.tfse = this.add.audio('tfse');
                this.diese = this.add.audio('diese');
                this.bgm.loopFull(0.6);
                // Use "arcade" (platformer) physics.
                this.physics.startSystem(Phaser.Physics.ARCADE);
                // Define the player character. The anonymous function being called here takes an initial player
                // character object and a "run" game state object ("this"), and initializes the player character
                // object.
                this.player = (function (player, state) {
                    // First, make sure the player sprite has a reference to the total player object. This will be
                    // important later, when we want to define callbacks for collision handling.
                    player.sprite.gamedata = player;
                    // my sprites are too small oops
                    player.sprite.scale.setTo(4, 4);
                    // Define all the animations. I made kind of a lot of animations. I do plan on using them all
                    // eventually.
                    player.sprite.animations.add('idle', ['elijah1']);
                    player.sprite.animations.add('fall', ['elijah2']);
                    player.sprite.animations.add('jump', ['elijah5']);
                    player.sprite.animations.add('walk', [
                        'elijah2', 'elijah3', 'elijah4', 'elijah3'
                    ], 10, true);
                    player.sprite.animations.add('no-means-no', [
                        'elijah6', 'elijah7', 'elijah8', 'elijah9', 'elijah10', 'elijah11', 'elijah12'
                    ], 20, false);
                    player.sprite.animations.add('defend', ['elijah13', 'elijah14'], 5, true);
                    player.sprite.animations.add('calm-down', [
                        'elijah12', 'elijah11', 'elijah10', 'elijah9', 'elijah8', 'elijah7', 'elijah6'
                    ], 20, false);
                    player.sprite.animations.add('transform-to-blob', [
                        'elijah14', 'elijah15', 'elijah16', 'elijah17', 'elijah18',
                        'elijah24', 'elijah23', 'elijah22', 'elijah21'
                    ], 20, false);
                    player.sprite.animations.add('die',  [
                        'elijah6', 'elijah7', 'elijah8', 'elijah9', 'elijah10', 'elijah11', 'elijah12',
                        'elijah13', 'elijah14', 'elijah15', 'elijah16', 'elijah17', 'elijah18'
                    ], 15, false);
                    player.sprite.animations.add('transform-from-blob', [
                        'elijah21', 'elijah22', 'elijah23', 'elijah24',
                        'elijah18', 'elijah17', 'elijah16', 'elijah15', 'elijah14'
                    ], 20, false);
                    player.sprite.animations.add('blob-idle', ['elijah19']);
                    player.sprite.animations.add('blob-walk', ['elijah20', 'elijah21'], 5, true);
                    // Since the player character has feet and stands on things, most animations and transformations
                    // will make the most sense if the sprite is anchored evenly between the feet.
                    player.sprite.anchor.setTo(0.5, 1);
                    // We do want the player to start off playing an animation and not just grabbing a graphic out
                    // of nowhere. It would make the most sense to play whatever animation corresponds to the
                    // current "state" of the player object. (The "state" is my own way of externally tracking what
                    // animation is or should be currently playing.)
                    player.sprite.animations.play(player.state);
                    // It's a platformer guy.
                    state.physics.arcade.enable(player.sprite);
                    // The player object needs to have a reference to the game state to which it belongs, for
                    // reasons.
                    player.gamestate = state;
                    // Snowclone of physics from first assignment. This is subject to change in the future.
                    player.sprite.body.bounce.y = 0.1;
                    player.sprite.body.gravity.y = 700;
                    return player;
                })({
                    // Here is how the player character object looks before any initialization in the above
                    // anonymous function.
                    sprite: this.add.sprite(this.game.width/3, this.game.height/3, 'atlas'),
                    state: 'fall',
                    facing: 'right',
                    setFacing: function (dir) {
                        // setFacing: If it's not the facing we already have, flip the sprite. In any case, now
                        // we're facing that way.
                        if (dir != this.facing) {
                            this.sprite.scale.x = -this.sprite.scale.x;
                            this.facing = dir;
                        }
                    }, changeState: function (anim) {
                        // changeState: Simultaneously update the animation played by the sprite and the animation
                        // the game object thinks the sprite is playing.
                        if (this.state != anim) {
                            this.state = anim;
                            this.sprite.animations.play(anim);
                            // update bounding box
                            this.sprite.body.setSize(
                                this.sprite.width/this.sprite.scale.x,
                                this.sprite.height/this.sprite.scale.y, 0, 0);
                            // prevent falling through solids
                            this.sprite.y -= 2;
                        }
                    }, update: function () {
                        // update: This object's own little chunk of the update loop.
                        (function (cursors, player) {
                            // This anonymous function handles input.
                            if (cursors.right.isDown) {
                                // If we want to go right, try to go right. If we were standing, now we're walking.
                                // But, if we weren't standing, we're still doing whatever it is we were doing.
                                player.setFacing('right');
                                if (player.state == 'idle') {
                                    player.changeState('walk');
                                } else if (player.state == 'blob-idle') {
                                    player.changeState('blob-walk');
                                }
                                player.sprite.body.velocity.x = 500;
                            } else if (cursors.left.isDown) {
                                // Second verse same as first verse, but with left instead of right.
                                player.setFacing('left');
                                if (player.state == 'idle') {
                                    player.changeState('walk');
                                } else if (player.state == 'blob-idle') {
                                    player.changeState('blob-walk');
                                }
                                player.sprite.body.velocity.x = -500;
                            } else {
                                // If we don't want to go left or right, stop horizontal motion. If we were walking,
                                // now we're standing. But, if we weren't walking, we're still doing whatever it
                                // is we were doing.
                                player.sprite.body.velocity.x = 0;
                                if (player.state == 'walk') {
                                    player.changeState('idle');
                                } else if (player.state == 'blob-walk') {
                                    player.changeState('blob-idle');
                                }
                            }
                            if (cursors.up.isDown
                                    && player.sprite.body.touching.down
                                    && (player.state == 'walk' || player.state == 'idle')) {
                                // The player can jump if we're on top of something and also either standing or
                                // walking.
                                player.sprite.body.velocity.y = -500;
                                player.changeState('jump');
                                player.gamestate.jumpse.play();
                            }
                            if (cursors.down.isDown &&
                                    (player.state == 'walk' || player.state == 'idle')) {
                                player.sprite.body.gravity.y = 0;
                                player.gamestate.tfse.play('', 0, 0.5);
                                player.changeState('no-means-no');
                            }
                            if (cursors.down.isDown &&
                                    (player.state == 'blob-walk' || player.state == 'blob-idle')) {
                                player.sprite.body.gravity.y = 0;
                                player.gamestate.tfse.play('', 0, 0.5);
                                player.changeState('transform-from-blob');
                            }
                        })(this.gamestate.game.input.keyboard.createCursorKeys(), this);
                        switch (this.state) {
                            // Jumping becomes falling after the apex of the jump is passed.
                            case 'jump':
                                if (this.sprite.body.velocity.y >= 0)
                                    this.changeState('fall');
                            break;
                            // Falling becomes walking after we land.
                            case 'fall':
                                if (this.sprite.body.touching.down)
                                    this.changeState('walk');
                            break;
                            case 'no-means-no':
                                if (this.sprite.animations.currentAnim.isFinished)
                                    this.changeState('transform-to-blob');
                            break;
                            case 'transform-to-blob':
                                if (this.sprite.animations.currentAnim.isFinished) {
                                    this.changeState('blob-walk');
                                    this.sprite.body.gravity.y = 700;
                                }
                            case 'transform-from-blob':
                                if (this.sprite.animations.currentAnim.isFinished)
                                    this.changeState('calm-down');
                            case 'calm-down':
                                if (this.sprite.animations.currentAnim.isFinished) {
                                    this.changeState('walk');
                                    this.sprite.body.gravity.y = 700;
                                }
                        }
                        if (this.sprite.body.y > this.gamestate.game.height
                            || (this.state == 'die' && this.sprite.animations.currentAnim.isFinished)) {
                            // If we fall off the edge or have finished playing the dying animation, we die.
                            this.gamestate.bgm.mute = true;
                            this.gamestate.state.start('gameOver');
                        }
                        // More logic to be added here later, probably!
                    }
                }, this);
                // Platform definitions
                this.solids = this.add.group();
                this.solids.enableBody = true;
                this.lastPlatformY = 0;
                this.makePlatform = function () {
                    return (function (platform, gamestate) {
                        gamestate.lastPlatformY = platform.y;
                        platform.checkWorldBounds = true;
                        platform.scale.setTo(4, 4); // my sprites are small
                        // random velocity
                        platform.body.velocity.x = -Math.random()*200 - 200;
                        // destroy on screen exit
                        platform.events.onOutOfBounds.add(function (platform) {platform.destroy();}, gamestate);
                        // don't fall when you step on them
                        platform.body.immovable = true;
                        return platform;
                    })(this.solids.create(this.game.width - 2,
                        this.game.height -
                            ((this.game.height - this.lastPlatformY) +
                                1.25*this.player.sprite.height)*Math.random(),
                        'atlas', 'eyeplatform'), this);
                };
                // create the starting platform, which will always be right underneath the player
                // so we don't instantly fall to our death
                (function (startingPlatform, gamestate) {
                    startingPlatform.x = gamestate.player.sprite.body.x;
                    startingPlatform.y = gamestate.player.sprite.body.y + gamestate.player.sprite.height + 16;
                    gamestate.lastPlatformY = startingPlatform.y;
                })(this.makePlatform(), this);
                // Enemy definitions
                this.hazards = this.add.group();
                this.hazards.enableBody = true;
                this.makeWiggly = function (platform) {
                    // wiggly: Phallic symbol with friendly face. Kills on contact.
                    // Sessile; the "spike" of this game
                    (function (wiggly, gamestate) {
                        wiggly.checkWorldBounds = true;
                        wiggly.scale.setTo(2.5, 2.5); // my sprites are too small again
                        wiggly.anchor.setTo(0.5, 1);
                        // It goes like: \ | / | \ | / | \ | / | you know like waving it around
                        wiggly.animations.add('idle', ['wiggly1', 'wiggly2', 'wiggly1', 'wiggly3'], 5, true);
                        wiggly.animations.play('idle');
                        // Spawn at a random position on the platform
                        wiggly.x = platform.x + wiggly.width
                            + (platform.width - wiggly.width*2)*Math.random();
                        wiggly.y = platform.y;
                        // Travel with the platform
                        wiggly.body.velocity.x = platform.body.velocity.x;
                        // Destroy on screen exit
                        wiggly.events.onOutOfBounds.add(function (wiggly) {
                            if (wiggly.x < 0) wiggly.destroy();
                        }, gamestate);
                    })(this.hazards.create(platform.x, platform.y, 'atlas', 'wiggly1'), this);
                };
                this.makeHand = function (platform) {
                    // hand: It wants to grab you so it glides along platforms toward the left
                    // This enemy is not really working very well.
                    (function (hand, gamestate) {
                        hand.checkWorldBounds = true;
                        hand.scale.setTo(-2, 2); // sprites too small
                        hand.anchor.setTo(0.5, 1);
                        // spawn at random position on platform (is this desirable if it's going to move left?)
                        hand.x = gamestate.game.width + hand.width/2 - 1;
                        hand.y = platform.y;
                        // destroy on screen exit
                        hand.events.onOutOfBounds.add(function (hand) {
                            if (hand.x < 0) hand.destroy();
                        }, gamestate);
                        // it has game data like the player does
                        hand.gamedata = {
                            sprite: hand,
                            // random speed along the platform
                            speed: Math.random()*200 + 200,
                            // it sticks to the platform
                            home: platform
                        };
                        // if we want it to travel along the platform withouot giving it physics then we need
                        // to account for the platform's velocity
                        hand.body.velocity.x = platform.body.velocity.x + hand.speed
                        hand.update = function () {
                            // each frame it should:
                            (function (hand) {
                                if (hand.sprite.x > hand.home.x + hand.home.width) {
                                    // turn around and go left if it's at the right edge of the platform
                                    hand.sprite.scale.x = -Math.abs(hand.sprite.scale.x);
                                    hand.sprite.body.velocity.x = hand.home.body.velocity.x - hand.speed;
                                    hand.sprite.x = hand.home.x + hand.home.width - 1;
                                } else if (hand.sprite.x < hand.home.x) {
                                    // turn around and go right if it's at the left edge of the platform
                                    hand.sprite.scale.x = Math.abs(hand.sprite.scale.x);
                                    hand.sprite.body.velocity.x = hand.home.body.velocity.x + hand.speed;
                                    hand.sprite.x = hand.home.x + 1;
                                }
                            })(this.gamedata);
                        };
                    })(this.hazards.create(platform.x, platform.y, 'atlas', 'hand'), this);
                };
                // makeRandomRootedHazard: spawn either a wiggly or a hand on the given platform
                this.makeRandomRootedHazard = function (platform) {
                    (function (n, gamestate) {
                        if (n < 0.5) gamestate.makeWiggly(platform);
                        else gamestate.makeHand(platform);
                    })(Math.random(), this);
                };
                this.makeEyeScream = function () {
                    // eyescream: it's a fast flyer
                    (function (eyeScream, gamestate) {
                        // they come in different sizes
                        (function (n) {
                            eyeScream.scale.setTo(n, n)
                        })(Math.random()*2.5 + 1.5);
                        // destroy on screen exit
                        eyeScream.checkWorldBounds = true;
                        eyeScream.events.onOutOfBounds.add(function (eyeScream) {
                            if (eyeScream.x < 0) eyeScream.destroy();
                        }, gamestate);
                        // go random fast speed
                        eyeScream.body.velocity.x = -200*Math.random() - 200;
                        // usually it's open but sometimes it blinks
                        eyeScream.animations.add('idle', ['cobwebeye1']);
                        eyeScream.animations.add('blink', ['cobwebeye1', 'cobwebeye2', 'cobwebeye3'], 10, false);
                        eyeScream.animations.play('idle');
                        eyeScream.update = function () {
                            // here is how it blinks
                            if (this.animations.currentAnim.isFinished)
                                this.animations.play('idle');
                            if (Math.random() < 0.01) this.animations.play('blink');
                        }
                    })(this.hazards.create(this.game.width - 1, this.game.height*Math.random(),
                        'atlas', 'cobwebeye1'));
                };
                this.makeEyeMouth = function () {
                    // eyemouth: it's a slow flier
                    (function (eyeMouth, gamestate) {
                        // different sizes
                        (function (n) {
                            eyeMouth.scale.setTo(n, n)
                        })(Math.random()*2.5 + 1.5);
                        // destroy on screen exit
                        eyeMouth.checkWorldBounds = true;
                        eyeMouth.events.onOutOfBounds.add(function (eyeMouth) {
                            if (eyeMouth.x < 0) eyeMouth.destroy();
                        }, gamestate);
                        // go random slow speed
                        eyeMouth.body.velocity.x = -100*Math.random() - 100;
                        // chomp chomp chomp chomp chomp! munch munch munch
                        eyeMouth.animations.add('idle', [
                            'mouth1', 'mouth1', 'mouth1', 'mouth1', 'mouth1',
                            'mouth2', 'mouth3', 'mouth4', 'mouth3', 'mouth4', 'mouth3', 'mouth2'
                        ], 10, true);
                        eyeMouth.animations.play('idle');
                    })(this.hazards.create(this.game.width - 1, this.game.height*Math.random(),
                        'atlas', 'mouth1'));
                };
                this.makeRandomFreeFloatingHazard = function () {
                    // makeRandomFreeFloatingHazard: spawn either an eyescream or an eyemouth
                    (function (n, gamestate) {
                        if (n < 0.5) gamestate.makeEyeScream();
                        else gamestate.makeEyeMouth();
                    })(Math.random(), this);
                };
                // Your score is how many platforms have spawned while you've been alive
                this.scoreText = this.add.text(16, 16, '', {
                    fontSize: '18px', fill: '#fff'
                });
                this.maxtimer = 45; // maxtimer: time between platforms
                this.timer = this.maxtimer; // timer: time until next platform
            }, update: function () {
                // solids are solid
                this.game.physics.arcade.collide(this.player.sprite, this.solids, function (player, solid) {
                    if (player.y - solid.y > 0 && player.y - solid.y < 64) player.y = solid.y;
                });
                this.game.physics.arcade.overlap(this.player.sprite, this.solids, function (player, solid) {
                    player.y = solid.y;
                });
                // hazards are hazardous
                this.game.physics.arcade.overlap(this.player.sprite, this.hazards, function (player, hazard) {
                    (function (player) {
                        // hazards are only hazardous if you're not already dying
                        if (player.state == 'jump'
                            || player.state == 'fall'
                            || player.state == 'walk'
                            || player.state == 'idle') {
                            player.sprite.body.velocity.x = 0;
                            player.sprite.body.velocity.y = 0;
                            player.sprite.body.gravity.y = 0;
                            player.gamestate.diese.play();
                            player.changeState('die');
                        }
                    })(player.gamedata);
                });
                // i have to do this because for some reason i defined the update loop on the player's gamedata
                // object instead of the sprite itself and i don't feel like fixing it
                this.player.update();
                // this is the part that updates the score to the number of platforms survived
                // it works because every time a platform spawns the amount of time between them increases by
                // one tick
                this.scoreText.text = 'Platforms survived: ' + (this.maxtimer - 45)
                    + '\nArrowkeys to move and jump'
                    + '\nDown arrow while grounded to transform'
                    + '\nAs a blob, you\'re invincible, but can\'t jump!';
                this.timer--; // decrement the timer each tick
                if (this.timer <= 0) { // if the timer goes off:
                    (function (platform, gamestate) { // the platform that spawns might have an enemy on it
                        if (Math.random() < gamestate.maxtimer/125)
                            gamestate.makeRandomRootedHazard(platform);
                    })(this.makePlatform(), this); // with that in mind, spawn a platform
                    this.maxtimer++; // the next platform will take longer to appear
                    this.timer = this.maxtimer; // reset the timer accordingly
                }
                if (Math.random() < this.maxtimer/25000) // use the amount of time between platforms
                    this.makeRandomFreeFloatingHazard(); // to scale other difficulty settings
            }
        };
        return constructor;
    })(function (game) {}),
    // Here  is the game over state definition. It's basically almost exactly the same as the title screen state
    // definition, except pressing state leads to the title screen state instead of to the run state.
    gameOver: (function (constructor) {
        constructor.prototype = {
            preload: function () {
                Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
                this.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json',
                    Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            }, create: function () {
                this.game.stage.backgroundColor = '#000000';
                (function (gameOverSprite) {
                    gameOverSprite.scale.setTo(4, 4);
                    gameOverSprite.animations.add('idle', ['gameover']);
                    gameOverSprite.animations.play('idle');
                })(this.add.sprite(this.game.width/2 - 192, this.game.height/2 - 192, 'atlas'));
                this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
                this.pressSpace = this.add.text(16, this.game.height - 32, 'GAME OVER! Press Space', {
                    fontSize: '24px', fill: '#fff'
                })
            }, update: function () {
                if (this.spacebar.downDuration(1000/60))
                    this.state.start('titleScreen');
            }
        };
        return constructor;
    })(function (game) {})
});
