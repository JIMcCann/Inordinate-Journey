/*  main
    Not very useful yet. */
requirejs.config({baseUrl: '/js'});
requirejs(['game/states/setup', 'game/states/skelcomp',
            'game/states/skeletons/groups',
            'game/states/skeletons/player',
            'game/states/skeletons/playertest'],
function (setup, skelcomp, groups, player, playertest) {
    setup('skelcomp', groups, player, playertest);
});
