/*	game/states/skeletons/triangle
	A definition for greenie mctriangleface AKA Buff/Muscular Hank. */
define({
	create: function () {
		// there he is, look at him in all his glory
		this.triangularDude = this.groups.hazards.create(370, 290, 'atlas', 'triangle-boss');
		this.triangularDude.anchor.setTo(0.4, 1); // position origin
		this.triangleFlipTimeout = 30; // he flips every 30 frames, that's his animation
		this.triangularDude.body.setSize(this.triangularDude.width*2/3, this.triangularDude.height*2/3,
			this.triangularDude.width/6, this.triangularDude.height/6); // specify bounding box
	},
	update: function () {
		// do flip anim
		this.triangleFlipTimeout--;
		if (this.triangleFlipTimeout <= 0) {
			this.triangleFlipTimeout = 30;
			this.triangularDude.scale.x *= -1;
		}
	}
});
