/*  game/states/skeletons/player
    For use with game/states/skelcomp and game/states/skeletons/groups.
    Standard player character for regular ol' platforming.
    Controls depend on direction of gravity.
    If there's no gravity, can move freely in any direction. */
let DEBUG = false;
define(['game/keyDown', 'game/states/fadeOut', 'util/functional',
    'util/vectorMath'],
function (keyDown, fadeOut, F, VM) {return {
    create: function () {
        this.player = this.add.sprite(100, 0, 'atlas'); // move it during state creation, top left corner not ideal
        this.player.scale.setTo(1.5, 1.5); // change this depending on size of real assets
        // Which frames each animation uses is subject to change as final assets become available.
        this.player.animations.add('idle', ['guy-walk-1']);
        this.player.animations.add('walk', [
            'guy-walk-1', 'guy-walk-2', 'guy-walk-3',
            'guy-walk-4', 'guy-walk-5', 'guy-walk-6'], 10, true);
        this.player.animations.add('jump', ['guy-jump-4', 'guy-jump-5', 'guy-jump-6', 'guy-jump-7', 'guy-jump-8'], 10);
        this.player.animations.add('fall', ['guy-jump-9'], 10);
        this.player.animations.add('run', ['guy-run-1', 'guy-run-2', 'guy-run-3', 'guy-run-4',
            'guy-run-5', 'guy-run-6'], 10, true);
        this.player.anchor.setTo(0.5, 0.5); // for rotation
        this.player.animations.play('fall');
        this.game.physics.arcade.enable(this.player); // we want physics for the character
        /*
        this.player.body.bounce.x = -0.25;
        this.player.body.bounce.y = -0.25; // this may vary
        */
        this.player.body.gravity.y = 600; // this may also vary
        this.camera.follow(this.player); // camera should follow player
        this.playerStepTimer = 30; // 30 frames until next step noise
        this.playerWalkStrength = 40;
        this.playerJumpStrength = 220;
        this.playerMinRunSpeed = 250;
        this.playerFriction = 0.11;
        this.reldirs = {}; // Recalculate once per update loop
        this.relspeeds = {};
        // Fix problem with rapidly switching animations
        this.timeSinceOnGround = 1;
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
        if (this.groups.solids)
            this.game.physics.arcade.collide(this.player, this.groups.solids); // then treat them as solid
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
    playerStanding: function () {
        return ['idle', 'walk', 'run'].includes(this.player.animations.name);
    },
    playerOnGround: function () {
        let m = (this.player.body.blocked[VM.direction(this.reldirs.down)] ||
                 this.player.body.touching[VM.direction(this.reldirs.down)]) &&
                     this.relspeeds.up < 0.2;
        if (m) this.timeSinceOnGround = 0;
        else this.timeSinceOnGround++;
        return this.timeSinceOnGround < 5 && this.player.animations.name != 'jump';
    },
    playerDoJump: function () {
        this.player.body.velocity.x += this.reldirs.up.x*this.playerJumpStrength;
        this.player.body.velocity.y += this.reldirs.up.y*this.playerJumpStrength;
        this.player.animations.play('jump');
        this.game.audiosprite.play('jump');
    },
    playerDoWalk: function (vec) {
        this.player.body.velocity.x += vec.x*this.playerWalkStrength;
        this.player.body.velocity.y += vec.y*this.playerWalkStrength;
        if (this.player.animations.name == 'idle') this.player.animations.play('walk');
    },
    playerDoCheckRun: function () {
        let walkspd = Math.abs(VM.magnitude(this.player.body.velocity)*this.relspeeds.right);
        if (this.player.animations.name == 'walk' && walkspd > this.playerMinRunSpeed)
            this.player.animations.play('run');
        else if (this.player.animations.name == 'run' && walkspd < this.playerMinRunSpeed)
            this.player.animations.play('walk');
    },
    playerDoFallFromLedges: function () {
        if (this.playerStanding() // If we're standing or walking
                && !this.playerOnGround()) { // but not on anything
            this.player.animations.play('fall'); // then we should fall
            if (DEBUG) console.log('fall off ledge');
        }
    },
    playerRespondWalk: function () {
        let tryingToWalk = false;
        for (let vec of [this.reldirs.left, this.reldirs.right]) if (keyDown(VM.direction(vec))) { // If we are:
            tryingToWalk = !tryingToWalk; // Record it (this will be important later)
            this.playerDoWalk(vec); // do it
        }
        return tryingToWalk;
    },
    playerRespondJump: function () {
        if (keyDown(VM.direction(this.reldirs.up)) // If we're trying to jump
                && this.playerOnGround()) { // from standing or walking:
            this.playerDoJump(); // then we can
            return true;
        }
        return false;
    },
    playerRotateByGravity: function () {
        this.player.angle = VM.angle(this.player.body.gravity) - 90; // Rotate sprite according to gravity
    },
    playerFaceLeft: function () {
        this.player.scale.x = -Math.abs(this.player.scale.x);
    },
    playerFaceRight: function () {
        this.player.scale.x = Math.abs(this.player.scale.x);
    },
    playerDoUpdatePlatformerFacing: function () {
        if (this.relspeeds.left > 0) this.playerFaceLeft();
        else this.playerFaceRight();
    },
    playerDoFallFromJumping: function () {
        if (this.player.animations.name == 'jump' // If we're jumping
                && this.relspeeds.down > 0) { // but headed downward
            this.player.animations.play('fall'); //  then we're actually falling
            if (DEBUG) console.log('fall from jump');
        }
    },
    playerPlayLandingSound: function () {
        let hardness = this.relspeeds.down*VM.magnitude(this.player.body.velocity);
        if (hardness > 600)
            this.game.audiosprite.play('hard-land');
        else if (hardness > 150) this.game.audiosprite.play('land');
        // avoid thok-thok-thok glitch by not making a sound at all if we landed really lightly
    },
    playerDoLandFromFall: function () {
        if (['fall', 'jump'].includes(this.player.animations.name) // If we're falling
                && this.playerOnGround()) { // but just landed
            this.player.animations.play('walk'); // then we're walking (and possibly about to stand still)
            this.playerPlayLandingSound();
        }
    },
    playerDoStandStillFromWalk: function () {
        if (this.player.animations.name == 'walk')
            this.player.animations.play('idle');
    },
    playerDoApplyFriction: function () {
        // Calculate the vector difference between our velocity
        // and (friction)% of our projected velocity along the walking axis
        let v = VM.subtract(this.player.body.velocity,
            VM.scale(VM.project(this.player.body.velocity, this.reldirs.right), this.playerFriction));
        // Now that's our new velocity (this slows us down along the walking axis, a la friction)
        this.player.body.velocity.x = v.x;
        this.player.body.velocity.y = v.y;
    },
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
        this.playerRecalculateReldirs();
        if (DEBUG) console.log(VM.magnitude(this.player.body.velocity));
        this.playerCollideSolids();
        this.playerCollideHazards();
        if (VM.magnitude(this.player.body.gravity) < 0.01)
            this.playerDoTopDownPhysics();
        else this.playerDoPlatformerPhysics();
    }
};});

