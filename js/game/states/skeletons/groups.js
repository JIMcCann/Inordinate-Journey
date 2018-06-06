/*  game/states/skeletons/groups
	For use with game/states/skelcomp.
	Adds a "this.groups" to the compositor.
	References to groups added to the state should be stored there by name. */
define({
	init: function () {
		// literally all it does is add an object to store sprite groups in
		this.groups = {};
		// and two sprite groups we always need
		this.groups.solids = this.add.group();
		this.groups.solids.enableBody = true;
		this.groups.hazards = this.add.group();
		this.groups.hazards.enableBody = true;
	}
});
