define(['game/states/fixed/meta', 'game/states/functionCaller'], function (meta) {
	return function (callback) {
		return (meta({
			textSize: 24,
			options: [{
				name: 'Cancel',
				nextState: ['functionCaller', callback]
			}, {
				name: 'Really Erase',
				nextState: function () {
					localStorage.clear();
					return ['functionCaller', callback];
				}
			}],
		}))();
	};
});
