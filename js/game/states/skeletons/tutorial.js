/*  game/states/skeletons/tutorial
    Tutorial level with goofy geometry */
define(['game/states/skeletons/portal'], function (portal) {return {
    preload: function () {
        this.load.tilemap('testmap', 'assets/maps/testmap.json', null,
            Phaser.Tilemap.TILED_JSON);
        this.load.image('arrowkeys', 'assets/graphics/arrowkeys.png');
        this.load.image('tileset', 'assets/graphics/tileset.png');
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.tilemap = this.add.tilemap('testmap');
        this.tilemap.addTilesetImage('tileset', 'tileset');
        this.tilemap.setCollisionBetween(1, 100);
        this.solidLayer = this.tilemap.createLayer('solid');
        //this.groups.solids = this.add.group();
        //this.groups.solids.add(this.solidLayer);
        this.physics.enable(this.solidLayer);
        this.arrowkeysImage = this.add.image(100, 200, 'arrowkeys');
        this.arrowkeysImage.scale.setTo(0.75);
        this.addSkel(portal);
        this.portal.x = 370;
        this.portal.y = 250;
    },
    update: function () {
        let STATE = this;
        this.game.physics.arcade.collide(this.player, this.solidLayer, function () {
            STATE.playerDoLandFromFall();
        });
    }
};});
