/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'util/vectorMath'], function (keyDown, VM) {return {
    preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
    },
    create: function () {
		this.spawnPlatform = function()
		{
			// REDUNDANT CODE :: MERGE WITH BELOW
			let plat = this.groups.solids.create(Math.random()*400, -100,
            'atlas', 'platform-1');
			plat.scale.setTo(2);
            plat.body.immovable = true;
		}
		this.timer = this.game.time.create(false);
		this.timer.loop(1000, this.spawnPlatform, this);

		this.timer.start();
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player.body.collideWorldBounds=true;
        this.game.audiosprite.play('spacelava');

        this.triangularDude = this.add.image(370, 290, 'atlas', 'triangle-boss');
        this.triangularDude.anchor.setTo(0.4, 1);
        this.triangleFlipTimeout = 30;
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        let plats = ['1', '2', '3'];
        //for (let p of plats) {
        for( var i = -1; i<10; i++){
            let x = Math.floor(Math.random() * 3);
            let plat = this.groups.solids.create(Math.random()*400, i*75,
                'atlas', 'platform-' + plats[x]);
            plat.scale.setTo(2);
            plat.body.immovable = true;
        }

        this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
        let lava = this.groups.hazards.create(0, 550, 'atlas', 'lava');
        lava.width = 800;
        lava.height = 50;
    },
    update: function () {

		this.groups.solids.forEach(function(platform){platform.body.y += 1;});
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
