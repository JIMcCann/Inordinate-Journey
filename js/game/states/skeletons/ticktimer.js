/*	game/states/skeletons/ticktimer
	Replacement for Phaser timer. Works on game time, not realtime, and allows events
	to scale their own frequency over time by returning a number,
	or to disable themselves by returning false.
	This is a little buggy as it occasionally results in large clusters of events,
	but it hasn't been a problem yet. */
define({
	create: function () {
		this.ticktimerTicks = 0; // no ticks yet
		this.ticktimerEvents = []; // no events yet
	},
	addTicktimerEvent: function (freq, ev) {
		// Every freq ticks, do ev
		this.ticktimerEvents[this.ticktimerEvents.length] = {
			frequency: freq, callback: ev
		};
	},
	update: function () {
		this.ticktimerTicks++; // another tick has passed
		let toRemove = []; // prepare a queue for events to get rid of
		for (let e of this.ticktimerEvents) if ((this.ticktimerTicks % e.frequency) < 1) {
			// do all the events
			let result = e.callback.call(this, this.ticktimerTicks);
			if (result) e.frequency *= result; // scale frequency if number returned
			else if (result === false) toRemove[toRemove.length] = e; // enqueue for deletion if false returned
		}
		let toKeep = []; // prepare a queue for events NOT to get rid of
		for (let e of this.ticktimerEvents)
			if (!toRemove.includes(e)) // populate it with everything but the events to get rid of
				toKeep[toKeep.length] = e;
		this.ticktimerEvents = toKeep; // replace current event queue with events not to get rid of
			// (this gets rid of excluded events, of course)
	}
});
