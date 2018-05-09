/*  game/states/skeletons/player
    For use with game/states/skelcomp and game/states/skeletons/groups.
    Standard player character for regular ol' platforming.
    Controls depend on direction of gravity.
    If there's no gravity, can move freely in any direction. */
define(['game/keyDown', 'util/functional', 'util/vectorMath'], function (keyDown, F, VM) {return {
    create: function () {
        this.player = this.add.sprite(0, 0, 'atlas'); // move it during state creation
        this.player.scale.setTo(3, 3);
        // Which frames each animation uses is subject to change as final assets become available.
        this.player.animations.add('idle', ['guy-stand']);
        this.player.animations.add('walk', ['guy-walk1', 'guy-walk2', 'guy-walk3', 'guy-walk2'], 10, true);
        this.player.animations.add('jump', ['guy-walk1']);
        this.player.animations.add('fall', ['guy-walk3']);
        this.player.anchor.setTo(0.5, 1);
        this.player.animations.play('fall');
        this.game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.1;
        this.player.body.gravity.y = 600;
        this.camera.follow(this.player);
    },
    update: function () {
        if (this.layers && this.layers.solid)
            this.game.physics.arcade.collide(this.player, this.layers.solid);
        if (this.groups.solids)
            this.game.physics.arcade.collide(this.player, this.groups.solids);
        if (this.groups.hazards)
            this.game.physics.arcade.overlap(this.player, this.groups.hazards,
                function () {
                    F.curry(this.state.restart, true, false).apply(this.state, this.initargs);
                });
        let terminalVelocity = 400;
        if (this.player.body.gravity.x == 0 && this.player.body.gravity.y == 0) {
            this.player.angle = 0;
            let walkStrength = 100;
            let anyKeyDown = false;
            for (let vec of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}])
                if (keyDown(VM.direction(vec))) {
                    anyKeyDown = true;
                    this.player.body.velocity.x += vec.x*walkStrength;
                    this.player.body.velocity.y += vec.y*walkStrength;
                    this.player.animations.play('walk');
                    if (this.player.body.velocity.x < 0)
                        this.player.scale.x = -Math.abs(this.player.scale.x);
                    else this.player.scale.x = Math.abs(this.player.scale.x);
                }
            if (this.player.animations.name == 'walk' && !anyKeyDown) {
                this.player.animations.play('idle');
            }
            if (this.player.animations.name == 'idle') {
                this.player.body.velocity.x /= 2;
                this.player.body.velocity.y /= 2;
            }
        } else {
            let walkStrength = 100;
            let jumpStrength = 300;
            this.player.angle = VM.angle(this.player.body.gravity) - 90;
            let relativeLeft = VM.normalize(VM.rotate(this.player.body.gravity, 90));
            let relativeRight = VM.normalize(VM.rotate(this.player.body.gravity, -90));
            let relativeUp = VM.normalize(VM.rotate(this.player.body.gravity, 180));
            let eitherKeyDown = false;
            for (let vec of [relativeLeft, relativeRight]) if (keyDown(VM.direction(vec))) {
                eitherKeyDown = true;
                this.player.body.velocity.x += vec.x*walkStrength;
                this.player.body.velocity.y += vec.y*walkStrength;
                if (this.player.animations.name == 'idle')
                    this.player.animations.play('walk');
            }
            if (keyDown(VM.direction(relativeUp))
                    && (['idle', 'walk'].includes(this.player.animations.name))) {
                this.player.body.velocity.x += relativeUp.x*jumpStrength;
                this.player.body.velocity.y += relativeUp.y*jumpStrength;
                this.player.animations.play('jump');
            }
            if (['idle', 'walk'].includes(this.player.animations.name)
                    && !this.player.body.blocked[VM.direction(this.player.body.gravity)])
                this.player.animations.play('fall');
            if (VM.angle(VM.project(this.player.body.velocity, relativeRight)) != 0)
                this.player.scale.x = -Math.abs(this.player.scale.x);
            else this.player.scale.x = Math.abs(this.player.scale.x);
            if (this.player.animations.name == 'jump'
                    && VM.angle(VM.project(this.player.body.velocity, this.player.body.gravity)) == 90)
                this.player.animations.play('fall');
            if (this.player.animations.name == 'fall'
                    && this.player.body.blocked[VM.direction(this.player.body.gravity)])
                this.player.animations.play('walk');
            if (this.player.animations.name == 'walk' && !eitherKeyDown)
                this.player.animations.play('idle');
            let v = VM.subtract(this.player.body.velocity,
                        VM.scale(VM.project(this.player.body.velocity, relativeRight), 0.2));
            this.player.body.velocity.x = v.x;
            this.player.body.velocity.y = v.y;
        }
    }
};});

