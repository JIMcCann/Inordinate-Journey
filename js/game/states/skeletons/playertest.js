define({
    preload: function () {
        this.load.tilemap('testmap', 'assets/temp/maps/testmap.json', null,
            Phaser.Tilemap.TILED_JSON);
    },
    create: function () {
        this.groups = {solids: this.add.group()};
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.add.tilemap('testmap');
        this.tilemap.addTilesetImage('solid', 'tileset');
        this.tilemap.setCollisionByExclusion([]);
        this.layers = {solid: this.tilemap.createLayer('solid')};
        this.layers.solid.resizeWorld();
        this.groups.solids.add(this.layers.solid);
    }
});
