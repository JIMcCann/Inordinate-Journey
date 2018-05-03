/*  game/keyDown
    Registers the keys we're interested in listening for
    and returns a function that checks if they're down
    as of the current frame. */
define(['game/game'], function (game) {
    let keyArr = ['spacebar', 'up', 'down', 'left', 'right', 'w', 's', 'a', 'd'];
    let keys = {};
    let equivmap = {
        up: 'w', down: 's', left: 'a', right: 'd',
        w: 'up', s: 'down', a: 'left', d: 'right'
    };
    let keyDown = function (key) {
        if (game.input && !keyDown.initialized) {
            for (let k of keyArr) {
                keys[k] = game.input.keyboard.addKey(Phaser.KeyCode[k.toUpperCase()]);
            }
            keyDown.initialized = true;
        }
        for (let k of [key, equivmap[key]])
            if (k && keys[k] && keys[k].downDuration(1000/game.time.fps))
                return true;
        return false;
    };
    return keyDown;
});
