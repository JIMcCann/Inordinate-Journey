/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'game/states/skeletons/portal', 'game/states/skeletons/spacebg',
    'game/states/skeletons/triangle', 'game/states/skeletons/ticktimer',
    'game/states/skeletons/flashingText',
    'util/functional', 'util/vectorMath'],
function (keyDown, portal, spacebg, triangle, ticktimer, flashingText, F, VM) {return {
    preload: function () {
		// Hi!
		// wEELLLLl heLLO theR
    },
    spawnPlatform: function (name, x, y) {
        let plat = this.groups.solids.create(x, y, 'atlas', name);
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.velocity.y = -75;
        plat.body.checkCollision.up = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        return plat;
    },
	entityWrap: function (entity) { // Function to an entity wrap to the other side of the screen
		if(entity.x > this.game.width + Math.abs(entity.width)){ // if entity leaves right side completely,
				entity.x = 0 - Math.abs(entity.width); // then place the entity barely off-screen on the left
			}
		if(entity.x < 0 - Math.abs(entity.width)){ // if entity leaves left side completely,
				entity.x = this.game.width + Math.abs(entity.width); // then place the entity barely off-screen on the right
			}	
	
	},
    create: function () {
        this.addSkel(ticktimer);
        this.addSkel(flashingText);
        this.game.audiosprite.play('bgm-moon');
        this.addSkel(spacebg);
        this.portal = undefined;
        this.player.x = this.game.width/2;
        this.player.y = this.game.height/3;
		this.game.stage.backgroundColor = '#034b59';
		
		this.addTicktimerEvent(100, function (ticks) {
		    let p = this.spawnPlatform(
		        'platform-moon-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*400, this.game.height+100);
		    p.body.velocity.y *= ticks/1200 + 1;
		    return 0.983;
		});
		this.addTicktimerEvent(1300, function () {
		    this.flashingText('Leaving orbit...');
		    return false; // don't run this again, only once
		});
        this.addTicktimerEvent(1700, function () {
            this.flashingText('Incoming rectangulo-planetoid field!!');
            return false;
        });
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
//        this.game.audiosprite.play('spacelava');
		
		this.player.y = this.game.height; // Start the player at the bottom of the screen
		let g = VM.rotate(this.player.body.gravity, 180);
        this.player.body.gravity.x = g.x;
        this.player.body.gravity.y = g.y;
		
		// Triangle Dude now moves across the screen, might replace with a diff enemy
		this.addSkel(triangle);
        this.triangularDude.scale.setTo(1, -1);
		this.triangularDude.body.velocity.x = 100;
		this.triangularDude.body.angularVelocity = 6;
		this.triangularDude.anchor.setTo(0.5, 0.5);
		
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        this.background = this.groups.solids.create(0,0,'atlas','moon');
        this.addTicktimerEvent(1, function () {this.background.y -= 0.25;});
        this.background.anchor.setTo(0,1);
        this.background.body.immovable=true;
        this.background.width = this.game.width;
        this.background.height = -1*(this.game.height/5);
        this.world.sendToBack(this.groups.solids);
        this.world.sendToBack(this.triangularDude);
        for(let i = -1; i<10; i++)
            this.spawnPlatform('platform-moon-' + (Math.floor(Math.random()*3) + 1),
                Math.random()*400, i*75);

        this.spacebgspeed=-this.spacebgspeed;
		
		// Lava is offscreen at the top just to kill the player.
		// Should fix.
        let lava = this.groups.hazards.create(0, 0-50, 'atlas', 'lava');
        lava.width = 800;
        lava.height = 50;
        this.addTicktimerEvent(2500, function () {
		    if (!this.portal) this.addSkel(portal);
		    this.portal.x = Math.random()*this.game.width;
		    this.portal.y = this.game.height;
		    this.portal.body.velocity.y = -120;
        });
        this.player.y -= 300;
    },
    update: function () {

		//this.groups.solids.forEach(function(platform){platform.body.y += 1;});
		// Using velocity for this to fix player bounce glitch

        // Gooferino the triangle duderino
        this.triangularDude.body.angularVelocity += 0.2;
		this.entityWrap(this.player); // wrapping on player
		this.entityWrap(this.triangularDude); // wrapping on triangularDude
    },
    render: function () {
//        this.game.debug.body(this.triangularDude);
    }
};});
