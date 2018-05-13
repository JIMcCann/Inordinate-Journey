/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'util/vectorMath'], function (keyDown, VM) {return {
    preload: function () {
        // Load the tilemap for my dumb test map
        this.load.tilemap('testmap', 'assets/temp/maps/testmap.json', null,
            Phaser.Tilemap.TILED_JSON);
    },
    create: function () {
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Put the tilemap in the game
        this.tilemap = this.add.tilemap('testmap');
        // Assign the loaded tileset (from game/setup) to the tilemap
        this.tilemap.addTilesetImage('tileset', 'tileset');
        // Collide with EVERYTHING
        this.tilemap.setCollisionBetween(1, 100);
        // Pull the 'solid' layer out of the tilemap and decide it is in fact solid
        this.layers = {solid: this.tilemap.createLayer('solid')};
        // not sure if this line is necessary???? poss. should remove
        this.physics.enable(this.layers.solid);
        // Set the size of the world to the size of the layer
        this.layers.solid.resizeWorld();
    },
    update: function () {
        // Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
        if (keyDown('spacebar')) {
            let g = VM.rotate(this.player.body.gravity, 5);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
    }
};});
