/*  main
    Not very useful yet.
    Current condition: just loads a silly little test room. */
requirejs.config({baseUrl: '/js'}); // Assume all module paths are relative to /js.
requirejs(['game/states/setup',
            'game/states/skelcomp',
            'game/states/skeletons/groups',
            'game/states/skeletons/player',
            'game/states/skeletons/playertest',
            'game/states/skeletons/space_level',
            'game/states/skeletons/side_to_side',
            'game/LevelOrder'],
function (setup, skelcomp, groups, player, playertest, spaceLevel, sideToSide, LevelOrder) {
    /*  Runs the preloader and then transitions to the state skeleton compositor.
        The SSC will then make a state out of:
        * the groups skeleton (which makes sure the state has a 'groups' property)
        * the player skeleton (which adds the player character)
        * the playertest skeleton (which adds the silly little test room) */
    LevelOrder.order = [playertest, spaceLevel, sideToSide];
    LevelOrder.current = 0;
    setup('skelcomp', groups, player, playertest);
});
