define(['util/vectorMath'], function (VM) {return {
	spawnFireball: function () {
		let fball = this.groups.hazards.create(Math.random()*this.game.width, 570, 'atlas', 'fireball');
		fball.anchor.setTo(0.5);
		fball.scale.setTo(Math.random() + 1.5);
		fball.body.velocity.y = -Math.random()*300 - 300;
		fball.body.velocity.x = Math.random()*250 - 125;
		fball.body.gravity.y = 300;
		fball.fliptimeout = 15;
		let STATE = this;
		fball.update = function () {
			this.angle = VM.angle(this.body.velocity) + 90;
			fball.fliptimeout--;
			if (fball.fliptimeout <= 0) {
				fball.fliptimeout = 15;
				fball.scale.x *= -1;
			}
			if (Math.random() < 0.005) {
				if (this.scale.y > 1) {
					let parts = Math.ceil(Math.random()*5) + 1;
					for (let i = 0; i < parts; i++) {
						let part = STATE.spawnFireball();
						part.x = this.x;
						part.y = this.y;
						part.scale.setTo(this.scale.y/Math.sqrt(parts));
						part.body.velocity.x += this.body.velocity.x;
						part.body.velocity.x /= 2;
						part.body.velocity.y += this.body.velocity.y;
						part.body.velocity.y /= 2;
					}
					this.destroy();
				}
			}
		};
		return fball;
	}
};});
