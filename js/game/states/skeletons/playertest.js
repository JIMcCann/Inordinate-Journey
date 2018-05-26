/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'util/functional', 'util/vectorMath'], function (keyDown, F, VM) {return {
    preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
        this.game.load.image('background', 'assets/graphics/background1.png');
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

		this.timer = this.game.time.create(false);
		this.timer.loop(1300, function () {
		    this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*400, -100);
		}, this);

		this.timer.start();
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player.body.collideWorldBounds=true;
        this.game.audiosprite.play('spacelava');

        this.triangleFlipTimeout = 30;
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        this.triangularDude = this.groups.solids.create(370, 290, 'atlas', 'triangle-boss');
        this.triangularDude.body.immovable = true;
        this.triangularDude.anchor.setTo(0.4, 1);
        this.world.sendToBack(this.groups.solids);
        this.world.sendToBack(this.triangularDude);
        for(let i = -1; i<10; i++)
            this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
                Math.random()*400, i*75);
        
        this.lavarock = this.game.add.tileSprite(0,0,500,600,'background');
        this.world.sendToBack(this.lavarock);

        this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
        let lava = this.groups.hazards.create(0, 550, 'atlas', 'lava');
        lava.width = 800;
        lava.height = 50;
    },
    update: function () {

		//this.groups.solids.forEach(function(platform){platform.body.y += 1;});
		// Using velocity for this to fix player bounce glitch

        this.lavarock.tilePosition.y -= 2;

        // Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
        if (keyDown('spacebar')) {
            let g = VM.rotate(this.player.body.gravity, 5);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
        // Gooferino the triangle duderino
        this.triangleFlipTimeout--;
        if (this.triangleFlipTimeout == 0) {
            this.triangleFlipTimeout = 30;
            this.triangularDude.scale.x *= -1;
        }
    }
};});
