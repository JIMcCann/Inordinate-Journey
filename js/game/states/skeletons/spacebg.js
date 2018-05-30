define({
    create: function () {
        this.spacebg = this.add.tileSprite(0, 0, 500, 600, 'atlas', 'space');
        this.spacebgspeed = 2;
    },
    update: function () {
        this.world.sendToBack(this.spacebg);
        this.spacebg.tilePosition.y -= this.spacebgspeed;
    }
});
