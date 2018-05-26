/*  game/states/fixed/titleScreen
    A function that will start a title screen state.
    Need art and audio for the title screen. */
let HAVE_TS_ASSETS = false;
define(['game/states/fixed/meta'], function (meta) {return meta({
    image: HAVE_TS_ASSETS ? 'title-screen' : undefined, // not yet in atlas
    audio: HAVE_TS_ASSETS ? 'title-screen' : undefined, // not yet in audiosprite
    text: "Press SPACE",
    textSize: 24
});});
