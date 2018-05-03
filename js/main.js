/*  main
    Not very useful yet. */
requirejs.config({baseUrl: '/js'});
requirejs(['game/states/setup', 'game/states/fixed'], function (setup, fixed) {
    setup('fixed', {
        text: 'Hello World!',
        textSize: 48
    });
});
