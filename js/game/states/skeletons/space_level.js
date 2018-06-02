/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'game/states/skeletons/portal', 'game/states/skeletons/spacebg',
    'game/states/skeletons/triangle', 'game/states/skeletons/ticktimer',
    'util/functional', 'util/vectorMath'],
function (keyDown, portal, spacebg, triangle, ticktimer, F, VM) {return {
	// Function that spawns a platform
	spawnPlatform: function (name, x, y) {
		// Create Solid Platform
        let plat = this.groups.solids.create(x, y, 'atlas', name);
        plat.scale.setTo(2);
        plat.body.immovable = true;
        plat.body.velocity.y = -75; // Set velocity to negative so it moves upwards
        plat.body.checkCollision.up = false;	// do not check collision on
        plat.body.checkCollision.left = false;	// all sides but the bottom
        plat.body.checkCollision.right = false;
        return plat;
    },
	// Function to an entity wrap to the other side of the screen
	entityWrap: function (entity) { 
		if(entity.x > this.game.width + Math.abs(entity.width)){ // if entity leaves right side completely,
				entity.x = 0 - Math.abs(entity.width); // then place the entity barely off-screen on the left
			}
		if(entity.x < 0 - Math.abs(entity.width)){ // if entity leaves left side completely,
				entity.x = this.game.width + Math.abs(entity.width); // then place the entity barely off-screen on the right
			}	
	
	},
    create: function () {
		// Add ticktimer to setup events
        this.addSkel(ticktimer);
		// Play music!
        this.game.audiosprite.play('bgm-moon');
		// Add space background
        this.addSkel(spacebg);
        this.portal = undefined;
		
		// Place player in correct position
        this.player.x = this.game.width/2;
        this.player.y = (this.game.height/3)-300;
		// Set Background Color just in case
		this.game.stage.backgroundColor = '#034b59';
		
		// timer to spawn a platform on interval
		this.addTicktimerEvent(100, function (ticks) {
		    let p = this.spawnPlatform(
		        'platform-moon-' + (Math.floor(Math.random()*3) + 1),
		        Math.random()*400, this.game.height+100);
		    p.body.velocity.y *= ticks/1200 + 1;
		    return 0.983;
		});
		
		// timers to show messages
		this.addTicktimerEvent(1300, function () {
		    this.flashingText('Leaving orbit...');
		    return false;
		});
		this.addTicktimerEvent(1700, function () {
		    this.flashingText('Incoming rectangulo-planetoid field!!');
		    return false;
		});
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
				
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
		
		// Add solids group
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
		// Add moon to solids
        this.moon = this.groups.solids.create(0,0,'atlas','moon');
		// Set the moon to scroll
        this.addTicktimerEvent(1, function () {this.moon.y -= 0.25;});
        this.moon.anchor.setTo(0,1);
        this.moon.body.immovable=true;
        this.moon.width = this.game.width;
        this.moon.height = -1*(this.game.height/5);
		
		// Send appropriate objects to back.
        this.world.sendToBack(this.groups.solids);
        this.world.sendToBack(this.triangularDude);
		
		// Spawn initial sets of platforms
        for(let i = -1; i<10; i++)
            this.spawnPlatform('platform-moon-' + (Math.floor(Math.random()*3) + 1),
                Math.random()*400, i*75);
      
        this.spacebgspeed=-this.spacebgspeed;
		
		// Lazy way of making a kill zone
        let killZone = this.groups.hazards.create(0, -100, 'atlas', 'moon');
        killZone.width = this.game.width;
        killZone.height = 50;

		// Add event for portal to spawn
        this.addTicktimerEvent(2500, function () {
		    if (!this.portal) this.addSkel(portal);
		    this.portal.x = Math.random()*this.game.width;
		    this.portal.y = this.game.height;
		    this.portal.body.velocity.y = -120;
        });
    },
    update: function () {
        // Gooferino the triangle duderino
        this.triangularDude.body.angularVelocity += 0.2;
		this.entityWrap(this.player); // wrapping on player
		this.entityWrap(this.triangularDude); // wrapping on triangularDude
    }
};});
