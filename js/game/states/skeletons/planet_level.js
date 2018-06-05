define(['game/keyDown', 'game/states/skeletons/portal', 'game/states/skeletons/spacebg',
    'game/states/skeletons/triangle', 'game/states/skeletons/fireball',
    'util/functional', 'util/vectorMath'],
function (keyDown, portal, spacebg, triangle, fireball, F, VM) {return {
    spawnPlanet: function () {
        let planet = this.groups.solids.create(Math.random()*this.game.width, -100, 'atlas', 'planet');
        planet.tint = Math.floor(Math.random()*(0xf - 0x7))*0x111111 + 0x777777;
        planet.anchor.setTo(0.5, 0.5);
        planet.scale.setTo(1 + Math.random()*3.5);
        planet.body.setCircle(planet.width/(2*planet.scale.x));
        planet.body.immovable = true;
        planet.body.velocity.y = (1 + Math.random())*100;
        planet.body.velocity.x = (2*Math.random() - 1)*50;
        planet.body.angularVelocity = (Math.random()*2 - 1)*50;
        return planet;
    },
    create: function () {
        this.game.audiosprite.play('bgm-moon');
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.turnOffLightLanding = true; // avoid annoying glitch whenn player lands repeatedly
        this.addSkel(fireball);
        this.addSkel(spacebg);
        this.spacebgspeed = -7;
        this.addSkel(triangle);
        this.portal = undefined;
        this.player.body.collideWorldBounds = true;

        this.game.stage.backgroundColor = '#666666';

        this.timer = this.game.time.create(false);
        this.timer.loop(1000, this.spawnPlanet, this);
        this.timer.start();

        this.groups.solids = this.add.group();
        this.groups.solids.enableBody = true;

        this.portalTimeout = 2500;

        this.playerJumpStrength /= 3;
        this.spawnPlanet().scale.setTo(5);
    },

    centerOfMassStrategy: function () {
        let gxsum = 0;
        let gysum = 0;
        let gcount = 0;
        this.groups.solids.forEachExists(function (it) {
            gxsum += it.body.center.x * it.scale.x/5;
            gysum += it.body.center.y * it.scale.y/5;
            gcount++;
        }, this);
        let gxavg = gxsum/(gcount + 1);
        let gyavg = gysum/(gcount + 1);
        let V = VM.scale(VM.subtract(VM.vector(gxavg, gyavg), this.player), 2);
        this.player.body.gravity.x = V.x;
        this.player.body.gravity.y = V.y + 20;
    },

    nearestMassiveStrategy: function () {
        let which = null;
        let dist = 0;
        let vol = 0;
        this.groups.solids.forEachExists(function (it) {
            let itvol = it.scale.x;
            let itdist = VM.magnitude(VM.subtract(it, this.player));
            if (!which || vol/dist < itvol/itdist) {
                which = it;
                vol = itvol;
                dist = itdist;
            }
        }, this);
        if (which) {
            let V = VM.scale(VM.subtract(which, this.player), 2);
            this.player.body.gravity.x = 100*vol*(V.x)/dist;
            this.player.body.gravity.y = 100*vol*(V.y)/dist;
            if (dist <= which.width + 5) this.playerDoForceLanding();
            this.player.angle = VM.angle(V) - 90;
        }
    },

    update: function () {
        let triangdist = VM.scale(
            VM.normalize(VM.subtract(this.player, this.triangularDude.body.center)),
            30);
        this.triangularDude.body.velocity.setTo(triangdist.x, triangdist.y);
        if (Math.random() < 0.007) {
            let fball = this.spawnFireball();
            fball.x = this.triangularDude.x;
            fball.y = this.triangularDude.y;
            fball.scale.setTo(fball.scale.y*2/3);
            fball.body.velocity.setTo(
                this.triangularDude.body.velocity.x*7,
                this.triangularDude.body.velocity.y*7 - 100);
        }
        this.nearestMassiveStrategy();
        if (this.player.y > this.game.height + 300)
            this.playerDie();
        this.portalTimeout--;
        if (this.portalTimeout <= 0 && !this.portal) {
            this.addSkel(portal);
            this.portal.x = Math.random()*this.game.width;
            this.portal.y = -50;
            this.portal.body.velocity.y = 36;
        }
    }
};});
