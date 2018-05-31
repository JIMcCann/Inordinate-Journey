/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'game/states/skeletons/portal',
    'game/states/skeletons/fireball', 'game/states/skeletons/ticktimer',
    'util/functional', 'util/vectorMath'],
function (keyDown, portal, fireball, ticktimer, F, VM) {return {
    preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
    },
    spawnPlatform: function (name, x, y) {
        let plat = this.groups.solids.create(x, y, 'atlas', name);
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.velocity.y = 60;
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        return plat;
    },
    create: function () {
        this.game.audiosprite.play('bgm-lava');
        this.addSkel(ticktimer);
        this.addSkel(fireball);
        this.portal = undefined;
		// Positioning the player at the start of the level
        this.player.x = this.game.width/2;
        this.player.y = 2*this.game.height/3;
		this.player.body.collideWorldBounds=true;

		// Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Play audio
//        this.game.audiosprite.play('spacelava');

		// Create 'solids' group
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;

		// Create 'hazards' group
		this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;

		// Create Lava
        this.lava = this.groups.hazards.create(0, 550, 'atlas', 'lava-1');
        this.lava.width = 800;
        this.lava.height = 50;
        this.lava.animations.add('idle', ['lava-1', 'lava-2', 'lava-3', 'lava-4', 'lava-5'], 10, true);
        this.lava.animations.play('idle');
        let STATE = this;
        this.lava.update = function () {
            STATE.groups.hazards.bringToTop(this);
        };

		// Setting a timer that will randomly generate platforms
		// starting from the top of the screen using 'spawnPlatform'
		// Updated this code to use ticktimer skeleton,
		// as Phaser builtin timer used previously runs in real time
		// and can therefore drop out of sync with gameplay in the event of lag
		this.addTicktimerEvent(90, function (ticks) {
		    let plat = this.spawnPlatform(
		        'platform-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*400, -100);
		    plat.body.velocity.y *= ticks/1500 + 1;
		    return 0.992; // return value of ticktimer event = amount to multiply delay
		});

		// send solids group the back
        this.world.sendToBack(this.groups.solids);

		// Generate initial platform
        let exampleplat = null;
        for(let i = -1; i<10; i++)
            exampleplat = this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
                Math.random()*400, i*75);

        this.lavarock = this.game.add.tileSprite(0,0,500,600,'atlas', 'volcano-wall');
        this.world.sendToBack(this.lavarock);
        let startplatform = this.spawnPlatform('platform-1',
            this.player.x - exampleplat.width/2,
            this.player.y + this.player.height/2);

        this.addTicktimerEvent(2000, function () {
            if (!this.portal) this.addSkel(portal);
            this.portal.x = Math.random()*this.game.width;
            this.portal.y = 0;
            this.portal.body.velocity.y = 120;
        });
    },
    update: function () {
        if (Math.random() < 0.004) this.spawnFireball().body.velocity.y *= 0.9;

		//this.groups.solids.forEach(function(platform){platform.body.y += 1;});
		// Using velocity for this to fix player bounce glitch

        this.lavarock.tilePosition.y -= 2;
        /*
        if (keyDown('spacebar')) {
            let g = VM.rotate(this.player.body.gravity, 5);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }*/
        // Gooferino the triangle duderino
        this.triangleFlipTimeout--;
        if (this.triangleFlipTimeout == 0) {
            this.triangleFlipTimeout = 30;
            this.triangularDude.scale.x *= -1;
        }

        if (this.player.y > this.lava.y) this.playerDie(); // workaround for inexplicable harmless lava
    },
  //  render: function () {
//        this.game.debug.body(this.lava);
    //}
};});
