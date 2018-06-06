/*  game/states/skeletons/side_to_side
	This level takes place in Mr. Triangle Angrydude's evil secret lair
	where there are zappy tesla coils, buzzsaws, and spikes */
define(['game/keyDown',
		'game/states/skeletons/portal',
		'game/states/skeletons/ticktimer',
		'util/functional', 'util/vectorMath'], function (keyDown, portal, ticktimer, F, VM) {return {
	spawnSaw: function () {
		// it's a saw
		let plat = this.groups.hazards.create(400, 0, 'atlas', 'saw-1');
		// it spins
		plat.animations.add('idle', [
			'saw-1', 'saw-2', 'saw-3', 'saw-4',
			'saw-5', 'saw-6', 'saw-7', 'saw-8'
		], 4, true);
		// it MIGHT be on the left wall instead of on the right wall
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=100;
		}
		// center origin
		plat.anchor.setTo(0.5);
		// flip horizontally
		plat.scale.x*=-1;
		plat.body.velocity.y=300; // it travels downward fast
		plat.body.immovable = true;
		plat.angle=90;
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x); //fit body to sprite
		if (pos != 1) plat.angle = -plat.angle; // facing depends on wall it's on
		plat.animations.play('idle'); //spin it
		plat.swaptimeout = 80; // unimplemented feature
		return plat;
	},
	spawnSpikes: function () {
		//it's a spikes
		let plat = this.groups.hazards.create(385, this.game.height, 'atlas', 'spikes');
		// it might be on the left wall
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=115;
		}
		plat.scale.setTo(2);
		plat.anchor.setTo(0.5); // center origin
		plat.body.velocity.y=-120; // go UP instead of down (spikes are floor-mounted)
		plat.body.immovable = true;
		plat.angle=90;
		if (pos != 1) plat.angle = -plat.angle; // facing depends on wall
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x); // fit body to sprite
		plat.swaptimeout = 80; // unimplemented feature
		return plat;
	},
	spawnTesla: function () {
		// it's a tesla coil
		let plat = this.groups.hazards.create(385, 0, 'atlas', 'tesla-1');
		// it zap
		plat.animations.add('idle', [
			'tesla-1', 'tesla-2', 'tesla-3', 'tesla-off', 'tesla-off', 'tesla-off'
		], 10, true);
		// might be on left wall
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=115;
		}
		plat.scale.setTo(2);
		plat.anchor.setTo(0.5); // center origin
		plat.body.velocity.y=100; // fall
		plat.body.immovable = true;
		plat.angle=90;
		if (pos != 1) plat.angle = -plat.angle; // facing depends on wall
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x); // fit body to sprite
		plat.animations.play('idle'); // zap
		return plat;
	},
	spawnHaz: function () {
		// Spawn either a tesla coil, a buzz saw, or spikes, randomly
		let hazspawners = [this.spawnTesla, this.spawnSaw, this.spawnSpikes];
		hazspawners[Math.floor(Math.random()*hazspawners.length)].call(this);
	},
	create: function () {
		this.game.stage.backgroundColor='#4f4d4d';
		this.game.audiosprite.play('bgm-side-to-side'); // lights camera action
		this.portal = undefined; // SSC glitch workaround

		this.addSkel(ticktimer); // will need to schedule events whose frequency can change
		// put a portal in the world once in awhile as a level exit
		this.addTicktimerEvent(2700, function () {
			if (!this.portal) this.addSkel(portal);
			this.portal.x = this.game.width/2;
			this.portal.y = 1 - this.portal.height;
			this.portal.body.velocity.y = 140;
		});
		// rather more often, and with increasing rate, spawn bads
		this.addTicktimerEvent(200, function () {
			this.spawnHaz();
			return 0.981;
		}, this);

		// Use arcade physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.player.x = this.game.width/2; // Start the player at the bottom of the screen
		this.player.y= this.game.height*0.75;
		this.playerJumpStrength=350;
		// gravity points left in this level
		let g = VM.rotate(this.player.body.gravity, 90);
		this.player.body.gravity.x = g.x;
		this.player.body.gravity.y = g.y;
		// can't walk offscreen
		this.player.body.collideWorldBounds=true;

		// mr buff hank briefly appears on screen to be like "wa ha ha this is my evil lair level"
		this.triangularDude = this.add.sprite(370, 290, 'atlas', 'triangle-boss');
		this.triangularDude.anchor.setTo(0.4, 1);
		this.triangleFlipTimeout = 30;
		this.game.physics.enable(this.triangularDude);
		this.triangularDude.body.velocity.x = 100; // but quickly wanders away

		// enforcing a desired display order of objects
		this.world.sendToBack(this.groups.solids);
		this.world.sendToBack(this.triangularDude);
		this.world.sendToBack(this.groups.hazards);

		// add background
		this.back=this.game.add.tileSprite(0,0,800,600,'atlas','sheetmetal');
		this.world.sendToBack(this.back);

		// add walls
		this.B1=this.game.add.tileSprite(0,0,100,this.game.height,'atlas', 'metal-wall');
		this.game.physics.arcade.enable(this.B1);
		this.B1.body.immovable=true;
		this.B2=this.game.add.tileSprite(this.game.width,0,100,this.game.height,'atlas', 'metal-wall');
		this.game.physics.arcade.enable(this.B2);
		this.B2.scale.x *=-1;
		this.B2.body.immovable=true
		this.B2.tilePosition.y-=200;
		this.groups.solids.add(this.B1);
		this.groups.solids.add(this.B2);
	},
	update: function () {

		// scroll background
		this.back.tilePosition.y +=2;

		// scroll walls
		this.B1.tilePosition.y -= 2;
		this.B2.tilePosition.y -= 2;

		// move player with walls when standing on them
		if (this.playerOnGround()) {
			this.player.y-=2;
		}

		// Gooferino the triangle duderino
		this.triangleFlipTimeout--;
		if (this.triangleFlipTimeout == 0) {
			this.triangleFlipTimeout = 30;
			this.triangularDude.scale.x *= -1;
		}

		// ability to jump is replaced with ability to... FLIP THE GRAVITY!!!
		if(this.player.x>this.game.width/2 && VM.direction(this.player.body.gravity)=='left'){
			let g = VM.rotate(this.player.body.gravity, 180);
			this.player.body.gravity.x = g.x;
			this.player.body.gravity.y = g.y;
		}
		else if(this.player.x<this.game.width/2 && VM.direction(this.player.body.gravity)=='right'){
			let g = VM.rotate(this.player.body.gravity, 180);
			this.player.body.gravity.x = g.x;
			this.player.body.gravity.y = g.y;
		}

	},
	render:function(){
		//this.game.debug.body(this.B2);
	}
};});
