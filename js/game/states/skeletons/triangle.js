define({
	create: function () {
		if (!this.groups.hazards) this.groups.hazards = this.add.group();
		this.groups.hazards.enableBody = true;
		this.triangularDude = this.groups.hazards.create(370, 290, 'atlas', 'triangle-boss');
		this.triangularDude.anchor.setTo(0.4, 1);
		this.triangleFlipTimeout = 30;
		this.triangularDude.body.setSize(this.triangularDude.width*2/3, this.triangularDude.height*2/3,
			this.triangularDude.width/6, this.triangularDude.height/6);
	},
	update: function () {
		this.triangleFlipTimeout--;
		if (this.triangleFlipTimeout <= 0) {
			this.triangleFlipTimeout = 30;
			this.triangularDude.scale.x *= -1;
		}
	}
});
