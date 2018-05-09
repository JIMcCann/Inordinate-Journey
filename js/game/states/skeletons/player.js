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
        this.player.animations.add('idle', 'guy-stand');
        this.player.animations.add('walk', 'guy-walk1', 'guy-walk2', 'guy-walk3', 'guy-walk2', 10, true);
        this.player.animations.add('jump', 'guy-walk1');
        this.player.animations.add('fall', 'guy-walk3');
        this.player.anchor.setTo(0.5, 1);
        this.player.animations.play('idle');
        this.game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.1;
        this.player.body.gravity.y = 700;
        if (!this.groups.player) this.groups.player = this.add.group();
        this.groups.player.add(this.player);
        this.camera.follow(this.player);
    },
    update: function () {
        if (this.groups.solids)
            this.game.physics.arcade.collide(this.groups.player, this.groups.solids);
        if (this.groups.hazards)
            this.game.physics.arcade.overlap(this.groups.player, this.groups.hazards,
                function () {
                    F.curry(this.state.restart, true, false).apply(this.state, this.initargs);
                });
        if (this.player.gravity.x == 0 && this.player.gravity.y == 0) {
            this.player.angle = 0;
            let walkStrength = 100;
            for (let vec of [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}])
                if (keyDown(VM.direction(vec)) {
                    this.player.body.velocity.x += vec.x*walkStrength;
                    this.player.body.velocity.y += vec.y*walkStrength;
                    this.player.animations.play('walk');
                    if (this.player.body.velocity.x < 0)
                        this.player.scale.x = -Math.abs(this.player.scale.x);
                    else this.player.scale.x = Math.abs(this.player.scale.x);
                }
        } else {
            let walkStrength = 100;
            let jumpStrength = 300;
            let terminalVelocity = 400;
            this.player.angle = VM.angle(this.player.gravity) - 90;
            let relativeLeft = VM.normalize(VM.rotate(this.player.gravity, 90));
            let relativeRight = VM.normalize(VM.rotate(this.player.gravity, -90));
            let relativeUp = VM.normalize(VM.rotate(this.player.gravity, 180);
            for (let vec of [relativeLeft, relativeRight]) if (keyDown(VM.direction(vec))) {
                this.player.body.velocity.x += vec.x*walkStrength;
                this.player.body.velocity.y += vec.y*walkStrength;
                this.player.animations.play('walk');
            }
            if (keyDown(VM.direction(relativeUp))
                    && (['idle', 'walk'].includes(this.player.animations.name))) {
                this.player.body.velocity.x += relativeUp.x*jumpStrength;
                this.player.body.velocity.y += relativeUp.y*jumpStrength;
                this.player.animations.play('jump');
            }
            if (VM.magnitude(VM.project(this.player.body.velocity, relativeRight)) < 0)
                this.player.scale.x = -Math.abs(this.player.scale.x);
            else this.player.scale.x = Math.abs(this.player.scale.x);
            if (this.player.animations.name == 'jump'
                    && VM.magnitude(VM.project(this.player.body.velocity, this.player.body.gravity)) > 0)
                this.player.animations.play('fall');
            if (this.player.body.touching[VM.direction(this.player.body.gravity)]
                    && this.player.animations.name == 'fall')
                this.player.animations.play('walk');
            if (this.player.animations.name == 'walk'
                    && this.player.velocity.x == 0
                    && this.player.velocity.y == 0)
                this.player.animations.play('idle');
            let m = VM.magnitude(this.player.velocity);
            if (m > terminalVelocity) {
                this.player.velocity.x *= terminalVelocity/m;
                this.player.velocity.y *= terminalVelocity/m;
            }
            // I am very scared of all this untested code. Will have to test ASAP.
        }
    }
};});

