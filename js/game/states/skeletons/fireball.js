/*	game/states/skeletons/fireball
	Adds a spawnFireball method to the SSC that creates a self-replicating fireball hazard. */
define(['util/vectorMath'], function (VM) {return {
	spawnFireball: function () {
		// create hazard
		let fball = this.groups.hazards.create(Math.random()*this.game.width, 570, 'atlas', 'fireball');
		fball.anchor.setTo(0.5); // center origin
		fball.scale.setTo(Math.random() + 1.5); // randomize size
		fball.body.velocity.y = -Math.random()*300 - 300; // randomize trajectory
		fball.body.velocity.x = Math.random()*250 - 125;
		fball.body.gravity.y = 300;
		fball.fliptimeout = 15; // it animates by flipping
		let STATE = this; // need to store current 'this' in a variable to capture it in the closure
		fball.update = function () {
			this.angle = VM.angle(this.body.velocity) + 90; // point sprite in direction of motion
			// do periodic flip animation
			fball.fliptimeout--;
			if (fball.fliptimeout <= 0) {
				fball.fliptimeout = 15;
				fball.scale.x *= -1;
			}
			// possibility of splitting off / self-replicating / "mitosis" or whatever
			if (Math.random() < 0.005) {
				if (this.scale.y > 1) { // but only if big enough
					let parts = Math.ceil(Math.random()*5) + 1; // random number of children (up to 6)
					for (let i = 0; i < parts; i++) { // add them all
						let part = STATE.spawnFireball();
						part.x = this.x; // the children should emerge from their parent
						part.y = this.y;
						part.scale.setTo(this.scale.y/Math.sqrt(parts)); // and be smaller than it
						part.body.velocity.x += this.body.velocity.x; // and be influenced by its trajectory
						part.body.velocity.x /= 2;
						part.body.velocity.y += this.body.velocity.y;
						part.body.velocity.y /= 2;
					}
					this.destroy(); // the parent split into its children so now it's gone
				}
			}
		};
		return fball; // return created fireball for further manipulation
	}
};});
