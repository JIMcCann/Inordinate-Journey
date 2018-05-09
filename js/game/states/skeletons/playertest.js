define(['game/keyDown', 'util/vectorMath'], function (keyDown, VM) {return {
    preload: function () {
        this.load.tilemap('testmap', 'assets/temp/maps/testmap.json', null,
            Phaser.Tilemap.TILED_JSON);
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.add.tilemap('testmap');
        this.tilemap.addTilesetImage('tileset', 'tileset');
        this.tilemap.setCollisionBetween(1, 100);
        this.layers = {solid: this.tilemap.createLayer('solid')};
        this.physics.enable(this.layers.solid);
        this.layers.solid.resizeWorld();
    },
    update: function () {
        if (keyDown('spacebar')) {
            let g = VM.rotate(this.player.body.gravity, 5);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
    }
};});
