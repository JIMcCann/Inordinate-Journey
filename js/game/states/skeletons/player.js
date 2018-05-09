/*  game/states/skeletons/player
    For use with game/states/skelcomp and game/states/skeletons/groups.
    Standard player character for regular ol' platforming. */
define(['util/functional', 'util/vectorMath'], function (F, VM) {return {
    create: function () {
        this.player = this.add.sprite(0, 0, 'atlas');
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
    },
    update: function () {
        if (this.groups.solids)
            this.game.physics.arcade.collide(this.groups.player, this.groups.solids);
        if (this.groups.hazards)
            this.game.physics.arcade.collide(this.groups.player, this.groups.hazards,
                function () {
                    F.curry(this.state.restart, true, false).apply(this.state, this.initargs);
                });
        let relativeLeft = VM.normalize(VM.rotate(this.player.gravity, 45));
        let relativeRight = VM.normalize(VM.rotate(this.player.gravity, -45));
    }
};});
