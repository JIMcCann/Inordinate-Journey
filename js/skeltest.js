requirejs.config({baseUrl: '/js'});
requirejs(['game/states/setup', 'game/states/skelcomp', 'util/functional'], function (setup, skelcomp, F) {
    let skels = [];
    for (let i = 0; i < 26; i++) skels[skels.length] = [{
        init: function () {
            console.log('skelcomp', i, 'init', arguments);
        },
        preload: function () {
            console.log('skelcomp', i, 'preload');
        },
        create: function () {
            console.log('skelcomp', i, 'create');
        },
        update: function () {
            console.log('skelcomp', i, 'update');
        }
    }, 4*i + 1, 4*i + 2, 4*i + 3];
    F.curry(setup, 'skelcomp').apply(null, skels);
});
