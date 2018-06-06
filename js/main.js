/*  main
    To be documented. */
requirejs.config({baseUrl: './js'}); // Assume all module paths are relative to /js.
requirejs(['game/states/functionCaller',
            'game/states/setup',
            'game/states/fixed/titleScreen',
            'game/states/skeletons/tutorial',
            'game/states/skeletons/tutorial2',
            'game/states/skeletons/playertest',
            'game/states/skeletons/space_level',
            'game/states/skeletons/side_to_side',
            'game/states/skeletons/planet_level',
            'game/states/skeletons/rain_level',
            'game/LevelOrder'],
function (functionCaller, setup, titleScreen,
        tutorial, tutorial2, playertest, spaceLevel, sideToSide, planetLevel,
        rainLevel,
        LevelOrder) {
    /*  Runs the preloader and then transitions to the function caller state.
        The function caller state will call the titleScreen function,
        which will transition to the title screen. */
    LevelOrder.order = [tutorial, tutorial2, playertest, spaceLevel, sideToSide, planetLevel, rainLevel];
    setup('functionCaller', titleScreen);
});
