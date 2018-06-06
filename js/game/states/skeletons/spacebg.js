/*	game/states/skeletons/spacebg
	Skeletonized this for reuse in multiple levels.
	Just a scrolling outer space / night sky background
	with customizable speed. */
define({
	create: function () {
		// add the background
		this.spacebg = this.add.tileSprite(0, 0, 500, 600, 'atlas', 'space');
		// hoo boy ma man that's a speed y backgroudn yets indeedcy
		this.spacebgspeed = 2;
	},
	update: function () {
		// it's always in the background because it's the background
		this.world.sendToBack(this.spacebg);
		// scroll it
		this.spacebg.tilePosition.y -= this.spacebgspeed;
	}
});
