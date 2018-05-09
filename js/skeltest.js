requirejs.config({baseUrl: '/js'});
requirejs(['game/states/setup', 'game/states/skelcomp'], function (setup, skelcomp) {
    setup('skelcomp', [{
        init: function () {
            console.log('skelcomp init', arguments);
        },
        preload: function () {
            console.log('skelcomp preload');
        },
        create: function () {
            console.log('skelcomp create');
        },
        update: function () {
            console.log('skelcomp update');
        }
    }, 1, 2, 3]);
});
