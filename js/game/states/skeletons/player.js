/*  game/states/skeletons/player
    For use with game/states/skelcomp and game/states/skeletons/groups.
    Standard player character for regular ol' platforming.
    Controls depend on direction of gravity.
    If there's no gravity, can move freely in any direction. */
define(['game/keyDown', 'util/functional', 'util/vectorMath'], function (keyDown, F, VM) {return {
    create: function () {
        this.player = this.add.sprite(0, 0, 'atlas'); // move it during state creation, top left corner not ideal
        this.player.scale.setTo(3, 3); // change this depending on size of real assets
        // Which frames each animation uses is subject to change as final assets become available.
        this.player.animations.add('idle', ['guy-stand']);
        this.player.animations.add('walk', ['guy-walk1', 'guy-walk2', 'guy-walk3', 'guy-walk2'], 10, true);
        this.player.animations.add('jump', ['guy-walk1']);
        this.player.animations.add('fall', ['guy-walk3']);
        this.player.anchor.setTo(0.5, 1); // Putting the anchor between the character's feet
            // makes a lot of collision / movement / placement related stuff convenient
        this.player.animations.play('fall');
        this.game.physics.arcade.enable(this.player); // we want physics for the character
        this.player.body.bounce.y = 0.1; // this may vary
        this.player.body.gravity.y = 600; // this may also vary
        this.camera.follow(this.player); // camera should follow player
    },
    update: function () {
        // If the tilemap skeleton (yet to be written) is loaded and it has a solid layer:
        if (this.layers && this.layers.solid)
            this.game.physics.arcade.collide(this.player, this.layers.solid); // then that layer is solid
        // If any sprites / etc declare themselves solid by being in the 'solids' group:
        if (this.groups.solids)
            this.game.physics.arcade.collide(this.player, this.groups.solids); // then they're also solid
        // If any sprites / etc declare themselves dangerous by being in the 'hazards' group:
        if (this.groups.hazards)
            this.game.physics.arcade.overlap(this.player, this.groups.hazards,
                function () {
                    // then restart the level when we touch them
                    // (death could be done more elegantly but we can worry about that later)
                    F.curry(this.state.restart, true, false).apply(this.state, this.initargs);
                });
        // Velocity achievable by relatively left or right conveyance is capped
        // so we can't zoom off into nowhere
        let terminalVelocity = 400;
        if (this.player.body.gravity.x == 0 && this.player.body.gravity.y == 0) { // If there's no gravity:
            this.player.angle = 0; // Then we should always be on our feet
            let walkStrength = 100;
            let anyKeyDown = false;
            // and able to move in any direction we choose
            for (let vec of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}])
                if (keyDown(VM.direction(vec))) { // If we are choosing to move in a direction:
                    anyKeyDown = true; // then record this fact
                    this.player.body.velocity.x += vec.x*walkStrength; // and walk in that direction
                    this.player.body.velocity.y += vec.y*walkStrength;
                    this.player.animations.play('walk');
                    if (this.player.body.velocity.x < 0) // If that direction is left-ish:
                        this.player.scale.x = -Math.abs(this.player.scale.x); // face left
                    else this.player.scale.x = Math.abs(this.player.scale.x); // Otherwise face right
                }
            if (this.player.animations.name == 'walk' && !anyKeyDown) { // If we didn't choose to move:
                this.player.animations.play('idle'); // stand still
            }
            if (this.player.animations.name == 'idle') { // As long as we're standing still:
                this.player.body.velocity.x /= 2; // try to smoothly bring us to a stop
                this.player.body.velocity.y /= 2;
            }
        } else { // If there's gravity:
            let walkStrength = 100;
            let jumpStrength = 300;
            this.player.angle = VM.angle(this.player.body.gravity) - 90; // Rotate sprite according to gravity
            let relativeLeft = VM.normalize(VM.rotate(this.player.body.gravity, 90)); // Determine walking dirs
            let relativeRight = VM.normalize(VM.rotate(this.player.body.gravity, -90));
            let relativeUp = VM.normalize(VM.rotate(this.player.body.gravity, 180)); // Determine jumping dir
            let eitherKeyDown = false; // Assume we're not trying to move in a walking dir
            for (let vec of [relativeLeft, relativeRight]) if (keyDown(VM.direction(vec))) { // If we are:
                eitherKeyDown = true; // Change that assumption
                this.player.body.velocity.x += vec.x*walkStrength; // Move in the walking dir
                this.player.body.velocity.y += vec.y*walkStrength;
                if (this.player.animations.name == 'idle') // If moving from standing:
                    this.player.animations.play('walk'); // Now we're walking
            }
            if (keyDown(VM.direction(relativeUp)) // If we're trying to jump
                    && (['idle', 'walk'].includes(this.player.animations.name))) { // from standing or walking:
                this.player.body.velocity.x += relativeUp.x*jumpStrength; // then we're allowed to jump
                this.player.body.velocity.y += relativeUp.y*jumpStrength;
                this.player.animations.play('jump');
            }
            if (['idle', 'walk'].includes(this.player.animations.name) // If we're standing or walking
                    && !this.player.body.blocked[VM.direction(this.player.body.gravity)]) // but not on anything
                this.player.animations.play('fall'); // then we should fall
            if (VM.angle(VM.project(this.player.body.velocity, relativeRight)) != 0)
                    // If we're going "backward"-ish (left when gravity is downward)
                this.player.scale.x = -Math.abs(this.player.scale.x); // face backward
            else this.player.scale.x = Math.abs(this.player.scale.x); // otherwise face forward (usually right)
            if (this.player.animations.name == 'jump' // If we're jumping
                    && VM.angle(VM.project(this.player.body.velocity, this.player.body.gravity)) == 90)
                        // but headed downward
                this.player.animations.play('fall'); // then we're actually falling
            if (this.player.animations.name == 'fall' // If we're falling
                    && this.player.body.blocked[VM.direction(this.player.body.gravity)]) // but just landed
                this.player.animations.play('walk'); // then we're walking (and possibly about to stand still)
            if (this.player.animations.name == 'walk' && !eitherKeyDown) // If we're walking,
                    // but no longer pressing a key to walk:
                this.player.animations.play('idle'); // then we're actually standing
            // Calculate the vector difference between our velocity
            // and 20% of our projected velocity along the walking axis
            let v = VM.subtract(this.player.body.velocity
                        VM.scale(VM.project(this.player.body.velocity, relativeRight), 0.2));
            // Now that's our new velocity (this slows us down along the walking axis, a la friction)
            this.player.body.velocity.x = v.x;
            this.player.body.velocity.y = v.y;
        }
    }
};});

