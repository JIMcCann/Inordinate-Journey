/*  game/states/skeletons/groups
    For use with game/states/skelcomp.
    Adds a "this.groups" to the compositor.
    References to groups added to the state should be stored there by name. */
define({
    init: function () {
        this.groups = {};
    }
});
