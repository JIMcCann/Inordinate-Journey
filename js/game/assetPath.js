/*  game/assetPath
    Are we using the real assets or the temp assets? */
let ASSETS_READY = false; // Change to "true" before final release
define(function() {
    if (ASSETS_READY) return 'assets';
    return 'assets/temp';
});
