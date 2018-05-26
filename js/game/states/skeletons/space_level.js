/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'util/functional', 'util/vectorMath'], function (keyDown, F, VM) {return {
    preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
    },
    spawnPlatform: function (name, x, y) {
        let plat = this.groups.solids.create(x, y, 'atlas', name);
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.velocity.y = -75;
        plat.body.checkCollision.up = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        return plat;
    },
	entityWrap: function (entity) { // Function to an entity wrap to the other side of the screen
		if(entity.x > this.game.width + Math.abs(entity.width)){ // if entity leaves right side completely,
				entity.x = 0 - Math.abs(entity.width); // then place the entity barely off-screen on the left
			}
		if(entity.x < 0 - Math.abs(entity.width)){ // if entity leaves left side completely,
				entity.x = this.game.width + Math.abs(entity.width); // then place the entity barely off-screen on the right
			}	
	
	},
    create: function () {
        this.player.x = this.game.width/2;
        this.player.y = this.game.height/3;
		this.game.stage.backgroundColor = '#034b59';
		
		this.timer = this.game.time.create(false);
		this.timer.loop(1300, function () {
		    this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*400, this.game.height+100);
		}, this);
		this.timer.start();
		
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
        this.game.audiosprite.play('spacelava');
		
		this.player.y = this.game.height; // Start the player at the bottom of the screen
		let g = VM.rotate(this.player.body.gravity, 180);
        this.player.body.gravity.x = g.x;
        this.player.body.gravity.y = g.y;
		
		// Triangle Dude now moves across the screen, might replace with a diff enemy
		// TODO: Make hazard
        this.triangularDude = this.add.sprite(370, 290, 'atlas', 'triangle-boss');
        this.triangularDude.anchor.setTo(0.4, 1);
        this.triangleFlipTimeout = 30;
		this.game.physics.enable(this.triangularDude);
		this.triangularDude.body.velocity.x = 100;
		
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        this.background = this.groups.solids.create(0,0,'atlas','moon');
        this.background.anchor.setTo(0,1);
        this.background.body.immovable=true;
        this.background.width = this.game.width;
        this.background.height = -1*(this.game.height/5);
        this.world.sendToBack(this.groups.solids);
        this.world.sendToBack(this.triangularDude);
        for(let i = -1; i<10; i++)
            this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
                Math.random()*400, i*75);

        this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
		
		// Lava is offscreen at the top just to kill the player.
		// Should fix.
        let lava = this.groups.hazards.create(0, 0-50, 'atlas', 'lava');
        lava.width = 800;
        lava.height = 50;
    },
    update: function () {

		//this.groups.solids.forEach(function(platform){platform.body.y += 1;});
		// Using velocity for this to fix player bounce glitch

        this.background.y-=1/4;
        // Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
        if (keyDown('spacebar')) {
            
			console.log(this.player.x);
        }
        // Gooferino the triangle duderino
        this.triangleFlipTimeout--;
        if (this.triangleFlipTimeout == 0) {
            this.triangleFlipTimeout = 30;
            this.triangularDude.scale.x *= -1;
        }
		this.entityWrap(this.player); // wrapping on player
		this.entityWrap(this.triangularDude); // wrapping on triangularDude
    }
};});
