/*  game/states/fixed/titleScreen
	A function that will start a title screen state.
	Need art and audio for the title screen. */
let HAVE_TS_ASSETS = true;
define(['game/states/fixed/meta', 'util/localStorageAvailable', 'game/states/fixed/eraseSave',
		'game/states/fixed/credits', 'game/states/fixed/controls', 'game/states/fixed/graderNote',
		'game/states/functionCaller'],
function (meta, localStorageAvailable, eraseSave, credits, controls, graderNote) {
	let retfunc = function () {
		let retparam = {
			image: HAVE_TS_ASSETS ? 'title-screen' : undefined,
			//audio: HAVE_TS_ASSETS ? 'title-screen' : undefined,
			textSize: 24,
			options: []
		};
		retparam.options[retparam.options.length] = {
			name: 'NOTE TO GRADERS',
			nextState: ['functionCaller', graderNote, retfunc]
		};
		if (localStorageAvailable) {
			if (!parseInt(localStorage.getItem('deathCount')))
				localStorage.setItem('deathCount', 0);
			if (localStorage.getItem('seenTutorial') != 'yes') {
				retparam.text = '(SPACE to select)';
				localStorage.setItem('seenTutorial', 'no');
			}
			if (localStorage.getItem('hardMode') != 'yes')
				localStorage.setItem('hardMode', 'no');
			if (localStorage.getItem('hardModeUnlocked') != 'yes')
				localStorage.setItem('hardModeUnlocked', 'no');
		}
		if (localStorageAvailable && parseInt(localStorage.getItem('currentLevel'))) {
			retparam.options[retparam.options.length] = {
				name: 'Continue',
				nextState: function () {
					this.game.levelOrder.current = localStorage.getItem('currentLevel');
					this.game.hardMode = (localStorage.getItem('hardMode') == 'yes');
					return ['resumeGame'];
				}
			};
		}
		retparam.options[retparam.options.length] = {
			name: 'New Game',
			nextState: function () {
				let seenTutorial = false;
				if (localStorageAvailable) {
					if (localStorage.getItem('seenTutorial') == 'yes') {
						localStorage.setItem('currentLevel', 2);
						seenTutorial = true;
					}
					else {
						localStorage.setItem('seenTutorial', 'yes');
						localStorage.setItem('currentLevel', 0);
					}
					localStorage.setItem('deathCount', 0);
					localStorage.setItem('hardMode', 'no');
				}
				this.game.levelOrder.current = (seenTutorial ? 2 : 0);
				this.game.hardMode = false;
				return ['resumeGame'];
			}
		};
		if (!localStorageAvailable || localStorage.getItem('hardModeUnlocked') == 'yes') {
			retparam.options[retparam.options.length] = {
				name: 'Hard Mode',
				nextState: function () {
					if (localStorageAvailable)
						localStorage.setItem('currentLevel', 2);
					this.game.levelOrder.current = 2;
					if (localStorageAvailable)
						localStorage.setItem('hardMode', 'yes');
					this.game.hardMode = true;
					return ['resumeGame'];
				}
			};
		}
		retparam.options[retparam.options.length] = {
			name: 'Controls',
			nextState: ['functionCaller', controls, retfunc]
		};
		retparam.options[retparam.options.length] = {
			name: 'Credits',
			nextState: ['functionCaller', credits, retfunc]
		};
		if (localStorageAvailable && parseInt(localStorage.getItem('currentLevel'))) {
			retparam.options[retparam.options.length] = {
				name: 'Erase Save Data',
				nextState: ['functionCaller', eraseSave, retfunc]
			};
		}
		return (meta(retparam))();
	}
	return retfunc;
});
