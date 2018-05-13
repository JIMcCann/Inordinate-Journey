/*  main
    Not very useful yet.
    Current condition: just loads a silly little test room. */
requirejs.config({baseUrl: '/js'}); // Assume all module paths are relative to /js.
requirejs(['game/states/setup',
            'game/states/skelcomp',
            'game/states/skeletons/groups',
            'game/states/skeletons/player',
            'game/states/skeletons/playertest'],
function (setup, skelcomp, groups, player, playertest) {
    /*  Runs the preloader and then transitions to the state skeleton compositor.
        The SSC will then make a state out of:
        * the groups skeleton (which makes sure the state has a 'groups' property)
        * the player skeleton (which adds the player character)
        * the playertest skeleton (which adds the silly little test room) */
    setup('skelcomp', groups, player, playertest);
});
