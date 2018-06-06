/*  game/states/skeletons/portal
	Portal prefab to send player to next room
*/
let PORTALDEBUG = false;
define({
	create: function () {
		this.portal = this.add.sprite(100, 0, 'atlas', 'portal-1');
		this.portal.scale.setTo(2, 2);
		this.portal.anchor.setTo(0.5, 0.5); // center origin

		// animate it
		this.portal.animations.add('idle', ['portal-1','portal-2','portal-3','portal-4','portal-5'], 10, true);
		this.portal.animations.play('idle');

		// it fall
		this.physics.arcade.enable(this.portal);
	},
	update: function () {
		let STATE = this; // need to store the current 'this' in a variable so the closure can capture it
		if(this.player) {
			this.game.physics.arcade.collide(this.player, this.portal,
				function () {
					// win when we hit the portal
					STATE.game.levelOrder.nextLevel();
				});
		}
	},
	render: function() {
		if (PORTALDEBUG) this.game.debug.body(this.player);
	}
});

