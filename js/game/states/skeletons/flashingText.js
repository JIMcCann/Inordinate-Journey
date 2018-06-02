define({
    flashingText: function (str) {
        let text = this.add.text(60, 60, str, {
            fontSize: 18, fill: '#ff3333'
        });
        let coroutine = (function* () {
            let timesToFlash = 7;
            let delayBetweenFlash = 20;
            for (let i = 0; i < timesToFlash; i++) {
                for (let j = 0; j < 2; j++) {
                    text.visible = !text.visible;
                    for (let j = 0; j < delayBetweenFlash; j++) yield;
                }
            }
            text.destroy();
            for (;;) yield;
        })();
        text.update = function () {coroutine.next();};
    }
});
