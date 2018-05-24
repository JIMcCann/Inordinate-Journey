/*  game/LevelOrder
    Keeps track of what level we're on and handles switching. */
define(['game/states/fadeOut',
        'game/states/skeletons/groups', 'game/states/skeletons/player'],
function (fadeOut, groupsSkel, playerSkel) {return {
    order: [],
    current: -1,
    nextLevel: function () {
        this.current += 1;
        if (this.current > this.order.length)
            this.current = 0;
        fadeOut('skelcomp', groupsSkel, playerSkel, this.order[this.current]);
    }
};});
