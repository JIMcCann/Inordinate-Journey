/*  game/states/skeletons/player
	For use with game/states/skelcomp and game/states/skeletons/groups.
	Standard player character for regular ol' platforming.
	Controls depend on direction of gravity.
	If there's no gravity, can move freely in any direction. */
let DEBUG = false;
let DEBUG_CHEATING = true; // if we can cheat, we can press Space to advance levels
define(['game/game', 'game/keyDown', 'game/states/fadeOut', 'util/functional',
	'util/vectorMath'],
function (game, keyDown, fadeOut, F, VM) {return {
	create: function () {
		this.player = this.add.sprite(100, 0, 'atlas'); // move it during state creation, top left corner not ideal
		this.player.scale.setTo(1.5, 1.5); // change this depending on size of real assets
		// Which frames each animation uses is subject to change as final assets become available.
		this.player.animations.add('idle', ['guy-walk-1']);
		this.player.animations.add('walk', [
			'guy-walk-1', 'guy-walk-2', 'guy-walk-3',
			'guy-walk-4', 'guy-walk-5', 'guy-walk-6'], 20, true);
		this.player.animations.add('jump',
			['guy-jump-4', 'guy-jump-5', 'guy-jump-6', 'guy-jump-7', 'guy-jump-8'], 10);
		this.player.animations.add('fall', ['guy-jump-9'], 10);
		this.player.animations.add('run', ['guy-run-1', 'guy-run-2', 'guy-run-3', 'guy-run-4',
			'guy-run-5', 'guy-run-6'], 10, true);
		this.player.anchor.setTo(0.5, 0.5); // for rotation
		this.player.animations.play('fall');
		this.game.physics.arcade.enable(this.player); // we want physics for the character
		this.player.body.bounce.x = -0.25;
		this.player.body.bounce.y = -0.25; // this may vary
		this.player.body.gravity.y = 600; // this may also vary
		this.camera.follow(this.player); // camera should follow player
		this.playerStepTimer = 30; // 30 frames until next step noise
		this.playerWalkStrength = 30;
		this.playerJumpStrength = 240;
		this.playerMinRunSpeed = 210;
		this.playerFriction = 0.11;
		this.reldirs = {}; // Recalculate once per update loop
		this.relspeeds = {};
		// Fix problem with rapidly switching animations
		this.timeSinceOnGround = 1;
		this.turnOffLightLanding = false; // for annoying bippity boop glitch
	},
	playerUpdateBodySize: function () {
		// Change the size and position of the collision body to remain consistent
		// even when animations change
		this.player.body.setSize(16, 16,
			this.player.width/(2*this.player.scale.x) - 8,
			this.player.height/(2*this.player.scale.y) - 8);
	},
	playerPlayStepSounds: function () {
		// Play step noises
		if (['walk', 'run'].includes(this.player.animations.name)) {
			this.playerStepTimer--;
			if (this.playerStepTimer <= 0) {
				this.playerStepTimer = (this.player.animations.name == 'walk' ? 30 : 10);
				let whichNoise = Math.floor(Math.random()*26) + 1;
				this.game.audiosprite.play('step-' + whichNoise);
			}
		}
	},
	playerCollideSolids: function () {
		// If any sprites / etc declare themselves solid by being in the 'solids' group:
		if (this.groups.solids) {
			this.game.physics.arcade.collide(this.player, this.groups.solids); // then treat them as solid
			this.game.physics.arcade.overlap(this.player, this.groups.solids, function (player, solid) {
				// Check if there are any passable sides
				let anySidePassable = false;
				for (let k of ['up', 'down', 'left', 'right']) if (!solid.body.checkCollision[k]) {
					anySidePassable = true; break;
				}
				// If there aren't , then the solid thing ought to be solid on the inside too
				if (!anySidePassable) {
					// so push the player out of it
					let centerOf = function (obj) {
						return VM.vector(obj.x + obj.width/2, obj.y + obj.height/2);
					}
					let centerDiff = VM.subtract(centerOf(solid.body), centerOf(player.body));
					let V = VM.subtract(player, VM.scale(VM.normalize(centerDiff), 16));
					player.x = V.x;
					player.y = V.y;
				}
			});
		}
	},
	playerDie: function () {
		// Stop audio and reset state
		this.game.audiosprite.stop();
		F.curry(fadeOut, this.state.current).apply(null, this.initargs);
	},
	playerCollideHazards: function () {
		// If any sprites / etc declare themselves dangerous by being in the 'hazards' group:
		let STATE = this;
		if (this.groups.hazards)
			this.game.physics.arcade.overlap(this.player, this.groups.hazards,
				function () {
					// then restart the level when we touch them
					// (death could be done more elegantly but we can worry about that later)
					STATE.game.audiosprite.stop();
					F.curry(fadeOut, STATE.state.current).apply(null, STATE.initargs);
				});
	},
	playerRecalculateReldirs: function () {
		// Get walking, jumping, and falling directions based on gravity
		this.reldirs = {
			left: VM.normalize(VM.rotate(this.player.body.gravity, 90)),
			right: VM.normalize(VM.rotate(this.player.body.gravity, -90)),
			up: VM.normalize(VM.rotate(this.player.body.gravity, 180)),
			down: VM.normalize(this.player.body.gravity)
		};
		for (let d in this.reldirs)
			this.relspeeds[d] =
				VM.scalarProject(this.player.body.velocity, this.reldirs[d]);
	},
	// playerStanding: True if the current animation is a grounded animation
	playerStanding: function () {
		return ['idle', 'walk', 'run'].includes(this.player.animations.name);
	},
	// playerOnGround: True if the player is (or was very recently) actually physically grounded
	// The "or was very recently" is a workaround for faulty collision detection
	playerOnGround: function () {
		let m = (this.player.body.blocked[VM.direction(this.reldirs.down)] ||
				 this.player.body.touching[VM.direction(this.reldirs.down)]) &&
					 this.relspeeds.up < 0.2;
		if (m) this.timeSinceOnGround = 0;
		else this.timeSinceOnGround++;
		return this.timeSinceOnGround < 20 && this.player.animations.name != 'jump';
	},
	// playerDoJump: Execute a jump. Calling this method will result in a jump
	// even if the player should not be able to do one. Therefore, it can be used
	// to force a jump, e.g. during a scripted event or as a special ability.
	playerDoJump: function () {
		// go "up" (relative to gravity)
		this.player.body.velocity.x += this.reldirs.up.x*this.playerJumpStrength;
		this.player.body.velocity.y += this.reldirs.up.y*this.playerJumpStrength;
		// play jump anim and sound
		this.player.animations.play('jump');
		this.game.audiosprite.play('jump', 0.1);
	},
	// playerDoWalk: Execute walking logic and animation.
	playerDoWalk: function (vec) {
		// move along the vector given
		this.player.body.velocity.x += vec.x*this.playerWalkStrength;
		this.player.body.velocity.y += vec.y*this.playerWalkStrength;
		// play walking animation if standing
		if (this.player.animations.name == 'idle') this.player.animations.play('walk');
	},
	// playerDoCheckRun: Transition from walking to running based on speed.
	playerDoCheckRun: function () {
		// get walking speed
		let walkspd = Math.abs(VM.magnitude(this.player.body.velocity)*this.relspeeds.right);
		// run if going fast enough and walking
		if (this.player.animations.name == 'walk' && walkspd > this.playerMinRunSpeed)
			this.player.animations.play('run');
		// walk if going slow enough and running
		else if (this.player.animations.name == 'run' && walkspd < this.playerMinRunSpeed)
			this.player.animations.play('walk');
	},
	// playerDoFallFromLedges: Check and process cartoony "road runner" situations involving missing ground.
	playerDoFallFromLedges: function () {
		if (this.playerStanding() // If we're standing or walking
				&& !this.playerOnGround()) { // but not on anything
			this.player.animations.play('fall'); // then we should fall
			if (DEBUG) console.log('fall off ledge');
		}
	},
	// playerRespondWalk: Execute walking logic and animation, but only if appropriate based on input.
	playerRespondWalk: function () {
		let tryingToWalk = false; // cehck if trying to walk
		for (let vec of [this.reldirs.left, this.reldirs.right]) if (keyDown(VM.direction(vec))) { // If we are:
			tryingToWalk = !tryingToWalk; // Record it (this will be important later)
			this.playerDoWalk(vec); // do it
		}
		return tryingToWalk;
	},
	// playerRespondJump: Execute a jump, but only if appropriate based on input and current player state.
	playerRespondJump: function () {
		if (keyDown(VM.direction(this.reldirs.up)) // If we're trying to jump
				&& this.playerStanding()) { // from standing or walking:
			this.playerDoJump(); // then we can
			return true;
		}
		return false;
	},
	// playerRotateByGravity: Rotate player sprite so that down is the direction of gravity.
	playerRotateByGravity: function () {
		this.player.angle = VM.angle(this.player.body.gravity) - 90; // Rotate sprite according to gravity
	},
	// playerFaceLeft: Flip sprite to the left.
	playerFaceLeft: function () {
		this.player.scale.x = -Math.abs(this.player.scale.x);
	},
	// same but to right
	playerFaceRight: function () {
		this.player.scale.x = Math.abs(this.player.scale.x);
	},
	// playerDoUpdatePlatformFacing: Logically control flipping when using platforming logic.
	playerDoUpdatePlatformerFacing: function () {
		if (this.relspeeds.left > 0) this.playerFaceLeft();
		else this.playerFaceRight();
	},
	// playerDoFallFromJumping: Change jumping animation to falling animation based on trajectory.
	playerDoFallFromJumping: function () {
		if (this.player.animations.name == 'jump' // If we're jumping
				&& this.relspeeds.down > 0) { // but headed downward
			this.player.animations.play('fall'); //  then we're actually falling
			if (DEBUG) console.log('fall from jump');
		}
	},
	// playerPlayLandingSound: Play a different sound depending on how hard we landed
	playerPlayLandingSound: function () {
		let hardness = this.relspeeds.down*VM.magnitude(this.player.body.velocity);
		if (hardness > 600)
			this.game.audiosprite.play('hard-land');
		else if (hardness > 100 && !this.turnOffLightLanding)
			this.game.audiosprite.play('land', 0.6);
		// avoid thok-thok-thok glitch by not making a sound at all if we landed really lightly
	},
	// playerDoForceLanding: The player is now "grounded" and eligible to walk and jump,
	// even if this physically should not be the case.
	playerDoForceLanding: function () {
		this.player.animations.play('walk');
		this.playerPlayLandingSound();
	},
	// playerDoLandFromFall: The player is now grounded but only if we landed on smething
	playerDoLandFromFall: function () {
		if (['fall', 'jump'].includes(this.player.animations.name) // If we're falling
				&& this.playerOnGround()) { // but just landed
			// then land
			this.playerDoForceLanding();
		}
	},
	// playerDoStandStillFromWalk: Stop walking
	playerDoStandStillFromWalk: function () {
		if (this.player.animations.name == 'walk')
			this.player.animations.play('idle');
	},
	// playerDoApplyFriction: Slow down (but not "vertically" (relative to gravity))
	playerDoApplyFriction: function () {
		// Calculate the vector difference between our velocity
		// and (friction)% of our projected velocity along the walking axis
		let v = VM.subtract(this.player.body.velocity,
			VM.scale(VM.project(this.player.body.velocity, this.reldirs.right), this.playerFriction));
		// Now that's our new velocity (this slows us down along the walking axis, a la friction)
		this.player.body.velocity.x = v.x;
		this.player.body.velocity.y = v.y;
	},
	// playerDoPlatformPhysics: Culmination of above logics to simulate platform environment.
	playerDoPlatformerPhysics: function () {
		this.playerPlayStepSounds();
		this.playerRotateByGravity();
		let tryingToWalk = this.playerRespondWalk();
		this.playerRespondJump();
		this.playerDoFallFromLedges();
		this.playerDoUpdatePlatformerFacing();
		this.playerDoFallFromJumping();
		this.playerDoLandFromFall();
		if (!tryingToWalk) this.playerDoStandStillFromWalk();
		this.playerDoApplyFriction();
		this.playerDoCheckRun();
	},
	// playerDoTopDownPhysics: Alternative physics never used in game.
	playerDoTopDownPhysics: function () {
		this.player.angle = 0; // In the absence of gravity, we should always be on our feet
		let anyKeyDown = false;
		// and able to move in any direction we choose
		for (let vec of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]) {
			if (keyDown(VM.direction(vec))) { // If we are choosing to move in a direction:
				anyKeyDown = true; // then record this fact
				this.playerDoWalk(vec); // walk that way
				if (this.player.body.velocity.x < 0) // If that direction is left-ish:
					this.player.scale.x = -Math.abs(this.player.scale.x); // face left
				else this.player.scale.x = Math.abs(this.player.scale.x); // Otherwise face right
			}
		}
		if (this.player.animations.name == 'walk' && !anyKeyDown) // If we didn't choose to move:
			this.player.animations.play('idle'); // stand still
		if (this.player.animations.name == 'idle') { // As long as we're standing still:
			this.player.body.velocity.x /= 2; // try to smoothly bring us to a stop
			this.player.body.velocity.y /= 2;
		} else { // Apply friction regardless
			this.player.body.velocity.x *= 0.8;
			this.player.body.velocity.y *= 0.8;
		}
	},
	update: function () {
		// keep consistent bounding box
		this.playerUpdateBodySize();
		// determine directions relative to gravity
		this.playerRecalculateReldirs();
		if (DEBUG) console.log(VM.magnitude(this.player.body.velocity));
		// handle collisions
		this.playerCollideSolids();
		this.playerCollideHazards();
		// which physics is used depends on whether there's a significant amount of gravity in effect
		if (VM.magnitude(this.player.body.gravity) < 0.01)
			this.playerDoTopDownPhysics();
		else this.playerDoPlatformerPhysics();
		// allow cheating if appropriate (e.g for testing)
		if (DEBUG_CHEATING && keyDown('spacebar'))
			this.game.levelOrder.nextLevel();
	},
	render: function () {
		if (DEBUG) this.game.debug.body(this.player);
	}
};});

