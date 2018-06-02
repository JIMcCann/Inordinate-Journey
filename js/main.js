/*  main
    Not very useful yet.
    Current condition: just loads a silly little test room. */
requirejs.config({baseUrl: './js'}); // Assume all module paths are relative to /js.
requirejs(['game/states/functionCaller',
            'game/states/setup',
            'game/states/fixed/titleScreen',
            'game/states/skeletons/tutorial',
            'game/states/skeletons/playertest',
            'game/states/skeletons/space_level',
            'game/states/skeletons/side_to_side',
            'game/states/skeletons/planet_level',
            'game/states/skeletons/rain_level',
            'game/LevelOrder'],
function (functionCaller, setup, titleScreen,
        tutorial, playertest, spaceLevel, sideToSide, planetLevel,
        rainLevel,
        LevelOrder) {
    /*  Runs the preloader and then transitions to the state skeleton compositor.
        The SSC will then make a state out of:
        * the groups skeleton (which makes sure the state has a 'groups' property)
        * the player skeleton (which adds the player character)
        * the playertest skeleton (which adds the silly little test room) */
    LevelOrder.order = [tutorial, rainLevel, playertest, spaceLevel, sideToSide, planetLevel];
    setup('functionCaller', titleScreen);
});
