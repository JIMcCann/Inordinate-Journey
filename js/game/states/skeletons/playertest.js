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
        // Play combined bgm
        this.game.audiosprite.play('spacelava');
        // Add in a bunch of stuff to provide better representation
        // for the assortment of sprites at our disposal
        this.triangularDude = this.add.image(370, 290, 'atlas', 'triangle-boss');
        this.triangularDude.anchor.setTo(0.4, 1);
        this.triangleFlipTimeout = 30;
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        let plats = ['1', '2', '3', 'moon'];
        for (let p of plats) {
            let plat = this.groups.solids.create(Math.random()*800, Math.random()*600,
                'atlas', 'platform-' + p);
            plat.body.immovable = true;
        }
        let moon = this.add.image(0, 400, 'atlas', 'moon');
        moon.width = 800;
        moon.height = 200;
        moon.sendToBack();
        this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
        let lava = this.groups.hazards.create(0, 550, 'atlas', 'lava');
        lava.width = 800;
        lava.height = 50;
    },
    update: function () {
        // Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
        if (keyDown('spacebar')) {
            let g = VM.rotate(this.player.body.gravity, 5);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
        // Gooferino the triangle duderino
        this.triangleFlipTimeout--;
        if (this.triangleFlipTimeout == 0) {
            this.triangleFlipTimeout = 30;
            this.triangularDude.scale.x *= -1;
        }
    }
};});
