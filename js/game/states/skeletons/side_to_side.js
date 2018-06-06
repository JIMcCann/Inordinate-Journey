/*  game/states/skeletons/playertest
	A dumb test map with smiley geometry shapes */
define(['game/keyDown',
		'game/states/skeletons/portal',
		'game/states/skeletons/ticktimer',
		'util/functional', 'util/vectorMath'], function (keyDown, portal, ticktimer, F, VM) {return {
	preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
	},
	spawnSaw: function () {
		let plat = this.groups.hazards.create(400, 0, 'atlas', 'saw-1');
		plat.animations.add('idle', [
			'saw-1', 'saw-2', 'saw-3', 'saw-4',
			'saw-5', 'saw-6', 'saw-7', 'saw-8'
		], 4, true);
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=100;
		}
		plat.anchor.setTo(0.5);
		plat.scale.x*=-1;
		plat.body.velocity.y=300;
		plat.body.immovable = true;
		plat.angle=90;
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x);
		if (pos != 1) plat.angle = -plat.angle;
		plat.animations.play('idle');
		plat.swaptimeout = 80;
/*        plat.update = function* () {
			for (let i = 0; i < this.swaptimeout; ++i) yield;
			this.body.velocity.x = 300 - 
		}*/
		//plat.body.checkCollision.top = false;
		plat.body.checkCollision.left = true;
		plat.body.checkCollision.right = true;
		return plat;
	},
	spawnSpikes: function () {
		let plat = this.groups.hazards.create(385, this.game.height, 'atlas', 'spikes');
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=115;
		}
		plat.scale.setTo(2);
		plat.anchor.setTo(0.5);
		plat.body.velocity.y=-120;
		plat.body.immovable = true;
		plat.angle=90;
		if (pos != 1) plat.angle = -plat.angle;
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x);
		plat.swaptimeout = 80;
		//plat.body.checkCollision.top = false;
		plat.body.checkCollision.left = true;
		plat.body.checkCollision.right = true;
		return plat;
	},
	spawnTesla: function () {
		let plat = this.groups.hazards.create(385, 0, 'atlas', 'tesla-1');
		plat.animations.add('idle', [
			'tesla-1', 'tesla-2', 'tesla-3', 'tesla-off', 'tesla-off', 'tesla-off'
		], 10, true);
		let pos = Math.ceil(Math.random()*2);
		if (pos == 1){
			plat.x=115;
		}
		plat.scale.setTo(2);
		plat.anchor.setTo(0.5);
		plat.body.velocity.y=100;
		plat.body.immovable = true;
		plat.angle=90;
		if (pos != 1) plat.angle = -plat.angle;
		plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x);
		plat.animations.play('idle');
		//plat.body.checkCollision.top = false;
		plat.body.checkCollision.left = true;
		plat.body.checkCollision.right = true;
		return plat;
	},
	spawnHaz: function () {
		let hazspawners = [this.spawnTesla, this.spawnSaw, this.spawnSpikes];
		hazspawners[Math.floor(Math.random()*hazspawners.length)].call(this);
	},
	create: function () {
		this.game.stage.backgroundColor='#4f4d4d';
		this.game.audiosprite.play('bgm-side-to-side');
		
		this.groups.hazards = this.add.group();
		this.portal = undefined;
		this.groups.hazards.enableBody = true;
		this.addSkel(ticktimer);
		this.addTicktimerEvent(2700, function () {
			if (!this.portal) this.addSkel(portal);
			this.portal.x = this.game.width/2;
			this.portal.y = 1 - this.portal.height;
			this.portal.body.velocity.y = 140;
		});
		this.addTicktimerEvent(200, function () {
			this.spawnHaz();
			return 0.981;
		}, this);
		
		// Use arcade physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

//        this.game.audiosprite.play('spacelava');
		
		this.player.x = this.game.width/2; // Start the player at the bottom of the screen
		this.player.y= this.game.height*0.75;
		this.playerJumpStrength=350;
		let g = VM.rotate(this.player.body.gravity, 90);
		this.player.body.gravity.x = g.x;
		this.player.body.gravity.y = g.y;
		this.player.body.collideWorldBounds=true;
		
		// Triangle Dude now moves across the screen, might replace with a diff enemy
		// TODO: Make hazard
		this.triangularDude = this.add.sprite(370, 290, 'atlas', 'triangle-boss');
		this.triangularDude.anchor.setTo(0.4, 1);
		this.triangleFlipTimeout = 30;
		this.game.physics.enable(this.triangularDude);
		this.triangularDude.body.velocity.x = 100;
		
		this.groups.solids = this.add.group();
		this.groups.solids.enableBody = true;
		this.world.sendToBack(this.groups.solids);
		this.world.sendToBack(this.triangularDude);
		this.world.sendToBack(this.groups.hazards);

		this.back=this.game.add.tileSprite(0,0,800,600,'atlas','sheetmetal');
		this.world.sendToBack(this.back);

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

		//this.groups.solids.forEach(function(platform){platform.body.y += 1;});
		// Using velocity for this to fix player bounce glitch
		// Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
		this.back.tilePosition.y +=2;

		this.B1.tilePosition.y -= 2;
		this.B2.tilePosition.y -= 2;
		if (this.playerOnGround()){
			this.player.y-=2;
		}
		// Gooferino the triangle duderino
		this.triangleFlipTimeout--;
		if (this.triangleFlipTimeout == 0) {
			this.triangleFlipTimeout = 30;
			this.triangularDude.scale.x *= -1;
		}

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
