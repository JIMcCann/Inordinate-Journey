/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown',
        'game/states/skeletons/portal',
        'game/states/skeletons/ticktimer',
        'util/functional', 'util/vectorMath'], function (keyDown, portal, ticktimer, F, VM) {return {
		create: function () {
        this.game.stage.backgroundColor='#4f4d4d';
        this.game.audiosprite.play('bgm-side-to-side');
        
		// Portal placement
        this.portal = undefined; // dont mind me, just preventing a bug
		if (!this.portal)
			this.addSkel(portal);
        this.portal.x = this.game.width-140;
        this.portal.y = 50;
        
		// Text
		let textStyle = {
			font: "16px Arial",
			fill: "#FFFFFF"
		};
		this.textGravity = this.game.add.text(this.game.width/2-100,this.game.height/2, 
			"Gravity can switch between\nstages. Stay vigilant!", textStyle);
		this.textExit = this.game.add.text(this.game.width-255, 20,
			"Exit tutorial", textStyle);
			
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
		// Player properties
        this.player.x = this.game.width/2; // Start the player at the bottom of the screen
        this.player.y= this.game.height*0.75;
        this.playerJumpStrength=350;
        let g = VM.rotate(this.player.body.gravity, 90);
        this.player.body.gravity.x = g.x;
        this.player.body.gravity.y = g.y;
        this.player.body.collideWorldBounds=true;
        
		// Declaring solids group
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        this.world.sendToBack(this.groups.solids);
		
		// Level Walls
        this.B1=this.game.add.tileSprite(0,0,100,this.game.height,'atlas', 'metal-wall');
        this.game.physics.arcade.enable(this.B1);
        this.B1.body.immovable=true;
		
        this.B2=this.game.add.tileSprite(this.game.width,0,100,this.game.height,'atlas', 'metal-wall');
        this.game.physics.arcade.enable(this.B2);
        this.B2.scale.x *=-1;
        this.B2.body.immovable=true
        this.B2.tilePosition.y-=200;
        
    // Add walls to solids
        this.groups.solids.add(this.B1);
        this.groups.solids.add(this.B2);
    },
    update: function () {
        if(this.player.x>this.game.width/2 && VM.direction(this.player.body.gravity)=='left'){
            let g = VM.rotate(this.player.body.gravity, 180);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
        else if(this.player.x<this.game.width/2 && VM.direction(this.player.body.gravity)=='right'){
            let g = VM.rotate(this.player.body.gravity, 180);
            this.player.body.gravity.x = g.x;
            this.player.body.gravity.y = g.y;
        }
    }
};});
