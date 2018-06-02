/*  game/states/skeletons/tutorial
    Tutorial level with goofy geometry */
define(['game/states/skeletons/portal', 'game/states/skeletons/ticktimer'], function (portal, ticktimer) {return {
	spawnPlatform: function (name, x, y) {
        let plat = this.groups.solids.create(x, y, 'atlas', name);
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.velocity.y = 60;
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        return plat;
    },
	createText: function (x, y, text, style){
		let t = new Text(this.game, x, y, text, style);
		return t;
	},
    preload: function () {
        this.load.image('arrowkeys', 'assets/graphics/arrowkeys.png');
    },
    create: function () {
		// Set Background Color just in case
		this.game.stage.backgroundColor = '#034b59';
		// Start physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds=true;

		
		this.groups.solids = this.add.group();
		this.groups.solids.enableBody = true;
		
		this.ground = this.groups.solids.create(0, this.game.height-100, 'atlas', 'moon');
		this.ground.width = this.game.width;
		this.ground.height = 100;
		this.ground.body.immovable = true;
		
		this.game.world.sendToBack(this.groups.solids);
		this.game.world.bringToTop(this.ground);
		
		// timer to spawn a platform on interval
		this.addSkel(ticktimer);
		
		// Timer event to spawn platforms
		this.addTicktimerEvent(100, function (ticks) {
		    let p = this.spawnPlatform(
		        'platform-moon-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*(this.game.width-100), 0);
		    return 1;
		});
        
        
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
