define({
    create: function () {
        this.ticktimerTicks = 0;
        this.ticktimerEvents = [];
    },
    addTicktimerEvent: function (freq, ev) {
        this.ticktimerEvents[this.ticktimerEvents.length] = {
            frequency: freq, callback: ev
        };
    },
    update: function () {
        this.ticktimerTicks++;
        for (let e of this.ticktimerEvents) if ((this.ticktimerTicks % e.frequency) < 1) {
            let result = e.callback.call(this, this.ticktimerTicks);
            if (result) e.frequency *= result;
        }
    }
});
