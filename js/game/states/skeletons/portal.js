/*  game/states/skeletons/portal
	Portal prefab to send player to next room
*/
let DEBUG = false;
define(['game/game', 'game/LevelOrder'],
function (game) {return {
    create: function () {
		this.portal = this.add.sprite(100, 0, 'atlas');
		this.portal.scale.setTo(2, 2);
		this.portal.anchor.setTo(0.5, 0.5);
		
		this.portal.animations.add('idle', ['portal-1','portal-2','portal-3','portal-4','portal-5','portal-6']);
		this.portal.animations.play('idle');
		
		this.physics.arcade.enable(this.portal);
    },
    update: function () {
        if(this.player){
			this.player.physics.arcade.collide(this.player, this.portal,
				function () {
					game.LevelOrder.nextLevel();
				});
    },
	render: function() {
		game.debug.body(this.player);
	}
};});

