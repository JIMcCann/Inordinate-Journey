/*	game/states/fixed/finalScore
	CONGRATULATIONS! YOU WIN! */
define(['game/states/fixed/meta', 'game/states/fixed/credits', 'game/states/functionCaller',
		'game/states/fixed/titleScreen',
		'util/localStorageAvailable'],
function (meta, credits, functionCaller, titleScreen, localStorageAvailable) {
	let summary = function () {
		let t = 'CONGRATULATIONS!\n'
		if (localStorageAvailable) {
			t += 'Your death count: ' + localStorage.getItem('deathCount') +
				(localStorage.getItem('hardMode') == 'yes' && localStorage.getItem('deathCount') == 0 ?
					'(WOW!!!!)\n' : '\n');
			if (localStorage.getItem('hardMode') == 'yes')
				t += 'Hard mode completed!!!\n';
			if (localStorage.getItem('hardModeUnlocked') == 'no') {
				localStorage.setItem('hardModeUnlocked', 'yes');
				t += 'Hard mode unlocked!\n';
			}
		}
		t += 'Press SPACE';
		return t;
	}
	return meta({
		text: summary,
		textSize: 24,
		nextState: ['functionCaller', function () {
			if (localStorageAvailable) {
				localStorage.setItem('currentLevel', 2);
				localStorage.setItem('deathCount', 0);
				localStorage.setItem('hardMode', 'yes');
			}
			credits(titleScreen);
		}]
	});
});
