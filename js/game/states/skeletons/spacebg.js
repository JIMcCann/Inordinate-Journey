define({
    create: function () {
        this.spacebg = this.add.tileSprite(0, 0, 500, 600, 'atlas', 'space');
    },
    update: function () {
        this.world.sendToBack(this.spacebg);
        this.spacebg.tilePosition.y -= 2;
    }
});
