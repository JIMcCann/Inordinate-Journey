/*	game/states/skeletons/snow
	Snow particle system. */
define({
	create: function () {
		let snow = this.add.emitter(this.world.width*2, -32, 600);
		snow.makeParticles('atlas', 'tiny-snow');
		snow.maxParticleScale = 1.5;
		snow.minParticleScale = 0.5;
		snow.setYSpeed(20, 50);
		snow.setXSpeed(-200, -150);
		snow.gravity = 0;
		snow.width = this.world.width*4;
		snow.start(false, 14000, 20);
	}
});
