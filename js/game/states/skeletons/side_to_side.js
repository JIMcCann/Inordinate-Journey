/*  game/states/skeletons/playertest
    A dumb test map with smiley geometry shapes */
define(['game/keyDown', 'util/functional', 'util/vectorMath'], function (keyDown, F, VM) {return {
    preload: function () {
        this.game.load.image('background1', 'assets/graphics/green1.png');
        this.game.load.image('background2', 'assets/graphics/green2.png');
        // Hi!
        // wEELLLLl heLLO theR
    },
    spawnSaw: function (name) {
        let plat = this.groups.hazards.create(390, 0, 'atlas', name);
        let pos = Math.ceil(Math.random()*2);
        if (pos == 1){
            plat.x=115;
        }
        plat.anchor.setTo(0.5);
        plat.body.velocity.y=100;
        plat.body.immovable = true;
        plat.angle=90;
        plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x);
        //plat.body.checkCollision.top = false;
        plat.body.checkCollision.left = true;
        plat.body.checkCollision.right = true;
        return plat;
    },
    spawnStatic: function (name) {
        let plat = this.groups.hazards.create(390, 0, 'atlas', name);
        let pos = Math.ceil(Math.random()*2);
        if (pos == 1){
            plat.x=115;
        }
        plat.anchor.setTo(0.5);
        plat.body.velocity.y=100;
        plat.body.immovable = true;
        plat.angle=90;
        plat.body.setSize(plat.height/plat.scale.y,plat.width/plat.scale.x);
        //plat.body.checkCollision.top = false;
        plat.body.checkCollision.left = true;
        plat.body.checkCollision.right = true;
        return plat;
    },
    create: function () {
        this.game.audiosprite.play('bgm-side-to-side');
        
        this.groups.hazards = this.add.group();
        this.groups.hazards.enableBody = true;
        this.timer = this.game.time.create(false);
        this.timer.loop(4000, function () {
            this.spawnStatic('platform-1');
        }, this);
        this.timer.start();
        
        // Use arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

//        this.game.audiosprite.play('spacelava');
        
        this.player.x = this.game.width/2; // Start the player at the bottom of the screen
        this.player.y= this.game.height*0.75;
        this.playerJumpStrength=350;
        let g = VM.rotate(this.player.body.gravity, 90);
        this.player.body.gravity.x = g.x;
        this.player.body.gravity.y = g.y;
        this.player.body.collideWorldBounds=true;
        
        // Triangle Dude now moves across the screen, might replace with a diff enemy
        // TODO: Make hazard
        this.triangularDude = this.add.sprite(370, 290, 'atlas', 'triangle-boss');
        this.triangularDude.anchor.setTo(0.4, 1);
        this.triangleFlipTimeout = 30;
        this.game.physics.enable(this.triangularDude);
        this.triangularDude.body.velocity.x = 100;
        
        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;
        this.world.sendToBack(this.groups.solids);
        this.world.sendToBack(this.triangularDude);

        let B1=this.groups.solids.create(0,0, 'background1');
        this.game.physics.arcade.enable(B1);
        B1.body.immovable=true;
        let B2=this.groups.solids.create(400,0, 'background2');
        this.game.physics.arcade.enable(B2);
        B2.body.immovable=true
    },
    update: function () {

        //this.groups.solids.forEach(function(platform){platform.body.y += 1;});
        // Using velocity for this to fix player bounce glitch
        // Rotate gravity whenever space is held (assumes the player is loaded into the SSC)
        if (keyDown('spacebar')) {
            
            console.log(this.player.x);
        }
        // Gooferino the triangle duderino
        this.triangleFlipTimeout--;
        if (this.triangleFlipTimeout == 0) {
            this.triangleFlipTimeout = 30;
            this.triangularDude.scale.x *= -1;
        }

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
