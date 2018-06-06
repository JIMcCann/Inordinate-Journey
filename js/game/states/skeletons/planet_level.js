/*	game/states/skeletons/planet_level
	A level where direction of gravity depends on proximity and mass of several planets
	constantly flying downward from the top of the screen. Also the triangle dude,
	who we decided is named "Muscular Hank" due to an in-joke revolving around a misunderstanding,
	slowly chases the player and shoots fireballs. */
define(['game/keyDown', 'game/states/skeletons/portal', 'game/states/skeletons/spacebg',
	'game/states/skeletons/triangle', 'game/states/skeletons/fireball',
	'util/functional', 'util/vectorMath'],
function (keyDown, portal, spacebg, triangle, fireball, F, VM) {return {
	// spawnPlanet: Create a planet of random size and luminosity
	spawnPlanet: function () {
		let planet = this.groups.solids.create(Math.random()*this.game.width, -100, 'atlas', 'planet');
		planet.tint = Math.floor(Math.random()*(0xf - 0x7))*0x111111 + 0x777777; // random luminosity
		planet.anchor.setTo(0.5, 0.5); // center origin
		planet.scale.setTo(1 + Math.random()*3.5); // random size
		planet.body.setCircle(planet.width/(2*planet.scale.x)); // CIRCULAR COLLISION BOUNDARY.
		planet.body.immovable = true;
		planet.body.velocity.y = (1 + Math.random())*100; // random trajectory (but downward)
		planet.body.velocity.x = (2*Math.random() - 1)*50;
		planet.body.angularVelocity = (Math.random()*2 - 1)*50; // slowly spin as falling
		return planet; // return for further manipulation
	},
	create: function () {
		this.game.audiosprite.play('bgm-moon');
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.turnOffLightLanding = true; // avoid annoying glitch whenn player lands repeatedly
		this.addSkel(fireball); // will need to spawn fireballs
		this.addSkel(spacebg); // will need to have space background
		this.spacebgspeed = -7; // it's fast
		this.addSkel(triangle); // will need to have muscular hank
		this.portal = undefined; // prevents SSC glitch
		this.player.body.collideWorldBounds = true; // found this feels better
			// than sometimes accidentally jumping off screen

		this.game.stage.backgroundColor = '#666666'; // never actually seen but a nice color anyway

		// this level just uses a regular timer instead of a ticktimer
		// because we don't need to speed up spawn rate or anything, it's already hard enough as it is
		this.timer = this.game.time.create(false);
		this.timer.loop(1000, this.spawnPlanet, this);
		this.timer.start();

		// the portal in this level ONLY APPEARS ONCE!
		this.portalTimeout = 2500;

		this.playerJumpStrength /= 3; // adjust player jump strength for particular mechanics of this level
		this.spawnPlanet().scale.setTo(5); // spawn a big starting planet
			// to make sure the player doesn't fall into oblivion
	},

	// centerOfMassStrategy
	// One possible strategy of directing gravity. Would've worked by pointing gravity toward the center of mass
	// of the planetary system. Even though this is more realistic, we didn't go with it because it was very hard
	// to ever land.
	centerOfMassStrategy: function () {
		let gxsum = 0;
		let gysum = 0;
		let gcount = 0;
		this.groups.solids.forEachExists(function (it) {
			gxsum += it.body.center.x * it.scale.x/5;
			gysum += it.body.center.y * it.scale.y/5;
			gcount++;
		}, this);
		let gxavg = gxsum/(gcount + 1);
		let gyavg = gysum/(gcount + 1);
		let V = VM.scale(VM.subtract(VM.vector(gxavg, gyavg), this.player), 2);
		this.player.body.gravity.x = V.x;
		this.player.body.gravity.y = V.y + 20;
	},

	// nearestMassiveStrategy
	// Instead of being drawn toward the center of mass, the player is exclusively drawn toward the planet
	// that would have the largest influence on the center of mass IF we were doing things that way.
	nearestMassiveStrategy: function () {
		// use a max algorithm
		let which = null;
		let dist = 0;
		let vol = 0;
		// check if each planet is the max
		this.groups.solids.forEachExists(function (it) {
			let itvol = it.scale.x; // get planet size
			let itdist = VM.magnitude(VM.subtract(it, this.player)); // get planet distance from player
			// if either this is the first planet or it's the most "closebig"
			if (!which || vol/dist < itvol/itdist) {
				which = it; // then it's the right one until further notice
				vol = itvol;
				dist = itdist;
			}
		}, this);
		// if we found an optimal planet
		if (which) {
			let V = VM.scale(VM.subtract(which, this.player), 2);
			// then gravity = 50(m/r^2)
			this.player.body.gravity.x = 100*vol*(V.x)/dist;
			this.player.body.gravity.y = 100*vol*(V.y)/dist;
			// To compensate for weird circular collision detection,
			// allow the player to land even if they aren't strictly exactly on the ground
			if (dist <= which.width + 5) this.playerDoForceLanding();
			this.player.angle = VM.angle(V) - 90;
		}
	},

	update: function () {
		// define Muscular Hank's behavior:
		// follow player
		let triangdist = VM.scale(
			VM.normalize(VM.subtract(this.player, this.triangularDude.body.center)),
			30);
		this.triangularDude.body.velocity.setTo(triangdist.x, triangdist.y);
		// shoot fireballs
		if (Math.random() < 0.007) {
			let fball = this.spawnFireball();
			fball.x = this.triangularDude.x;
			fball.y = this.triangularDude.y;
			fball.scale.setTo(fball.scale.y*2/3);
			fball.body.velocity.setTo(
				this.triangularDude.body.velocity.x*7,
				this.triangularDude.body.velocity.y*7 - 100);
		}
		// do gravity calculation
		this.nearestMassiveStrategy();
		// kill player if pushed too far off the bottom of the screen
		// (which is now an unusual occurrence because the player collides with world bounds)
		if (this.player.y > this.game.height + 300)
			this.playerDie();
		// countdown until portal
		this.portalTimeout--;
		// add portal if appropriate based on countdown
		if (this.portalTimeout <= 0 && !this.portal) {
			this.addSkel(portal);
			this.portal.x = Math.random()*this.game.width;
			this.portal.y = -50;
			this.portal.body.velocity.y = 36;
		}
	}
};});
