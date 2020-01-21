'use strict';

const rxjs = require('rxjs');

module.exports = function () {
	console.log('\n...demo-observable');

	const observable = new rxjs.Observable((observer) => {
		observer.next(1);
		observer.next(2);
		setTimeout(() => {
			observer.next(3);
			observer.complete();
		}, 1000);
	});

	console.log('- A subscribe');
	observable.subscribe({
		next: x => console.log('A:', x),
		error: err => console.error('- A error:', err),
		complete: () => console.log('- A complete')
	});
	console.log('- A after subscribe');

	setTimeout(() => {
		console.log('- B subscribed');
		observable.subscribe({
			next: x => console.log('B:', x),
			error: err => console.error('- B error:', err),
			complete: () => console.log('- B complete')
		});
		console.log('- B after subscribe');
	}, 3000);
};
