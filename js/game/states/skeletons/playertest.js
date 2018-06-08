/*  game/states/skeletons/playertest
	So named because it was originally a test room.
	It's no longer a test room. It's now the first level.
	It takes place inside a volcano.
	Platforms fall from above and into the lava below, which periodically spews fireballs. */
define(['game/keyDown', 'game/states/skeletons/portal',
	'game/states/skeletons/fireball', 'game/states/skeletons/ticktimer',
	'util/functional', 'util/vectorMath'],
function (keyDown, portal, fireball, ticktimer, F, VM) {return {
	preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
	},
	spawnPlatform: function (name, x, y) {
		// add a platform
		let plat = this.groups.solids.create(x, y, 'atlas', name);
		plat.scale.setTo(2); // make it big to compensate for tiny
		plat.body.immovable = true;
		plat.body.velocity.y = 60; // fall it
		// we can jump up through it
		plat.body.checkCollision.down = false;
		plat.body.checkCollision.left = false;
		plat.body.checkCollision.right = false;
		return plat;
	},
	create: function () {
		this.game.audiosprite.play('bgm-lava'); //m usic please
		this.addSkel(ticktimer); // will need specialized timer to schedule events whose frequency can change
		this.addSkel(fireball); // will need to be able to spawn fireballs
		this.portal = undefined; // SSC glitch workaround

		// Positioning the player at the start of the level
		this.player.x = this.game.width/2;
		this.player.y = 2*this.game.height/3;
		this.player.body.collideWorldBounds=true;

		// Use arcade physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

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

		// now the platforms will properly appear to fall into the lava
		this.world.sendToBack(this.groups.solids);

		// Put platforms into the level at periodic vertical positions
		// to give the impression they've already begun falling,
		// as well as to give the player something to climb
		let exampleplat = null;
		for(let i = -1; i<10; i++)
			exampleplat = this.spawnPlatform('platform-' + (Math.floor(Math.random()*3) + 1),
				Math.random()*400, i*75);

		// Add spoopy volcano stone walls
		this.back1=this.game.add.tileSprite(-50,0,150,600,'atlas','lavalside');
		this.world.sendToBack(this.back1);
		this.back2=this.game.add.tileSprite(550,0,150,600,'atlas','lavalside');
		this.back2.scale.x *=-1;
		this.back2.tilePosition.y-=200;
		this.world.sendToBack(this.back2);

		// Add back wall to function as background
		this.lavarock = this.game.add.tileSprite(0,0,500,600,'atlas', 'volcano-wall');
		this.world.sendToBack(this.lavarock);

		// Give the player a platform to stand on to begin with
		// so they don't immediately fall into the lava
		let startplatform = this.spawnPlatform('platform-1',
			this.player.x - exampleplat.width/2,
			this.player.y + this.player.height/2);

		// Spawn the portal every once in awhile (more than once in case we miss it the first time)
		this.addDisplayedTicktimerEvent('portal', 2000, function () {
			if (!this.portal) this.addSkel(portal);
			this.portal.x = Math.random()*this.game.width;
			this.portal.y = 0;
			this.portal.body.velocity.y = 120;
		});
	},
	update: function () {
		let prob = 0.004;
		if (!this.game.hardMode) prob /= 2;
		let velscale = 0.9;
		if (!this.game.hardMode) velscale *= 3/4;
		if (Math.random() < prob) this.spawnFireball().body.velocity.y *= velscale; // chance to spew fire

		// scroll backgrounds
		this.back1.tilePosition.y +=1;
		this.back2.tilePosition.y +=1;
		this.lavarock.tilePosition.y -= 2;

		// Gooferino the triangle duderino
		this.triangleFlipTimeout--;
		if (this.triangleFlipTimeout == 0) {
			this.triangleFlipTimeout = 30;
			this.triangularDude.scale.x *= -1;
		}

	},
};});
