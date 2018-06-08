define(function () {
	if (window.localStorage) {
		localStorage.setItem('test', 'zzz');
		try {
			return localStorage.getItem('test') == 'zzz';
		} catch (e) {
			return false;
		}
	} else return false;
});
