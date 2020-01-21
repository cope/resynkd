'use strict';

const rxjs = require('rxjs');

module.exports = function () {
	console.log('\n...demo-subject');

	const dataSubject = new rxjs.BehaviorSubject();
	console.log('- sending', 'Hello Behavior');
	dataSubject.next('Hello Behavior');

	console.log('- A subscribed...');
	const dataWatchA = dataSubject.subscribe(val => console.log('A:', val));
	dataWatchA.next('dataWatchA woohoo');

	setTimeout(() => {
		console.log('- B subscribed...');
		const dataWatchB = dataSubject.subscribe(val => console.log('B:', val));
	}, 1000);

	const timer = rxjs.interval(400);
	let timerSub = timer.subscribe(val => {
		console.log('- sending', val);
		dataSubject.next(val);
	});
	timerSub.next('timerSub woohoo');

	setTimeout(() => {
		console.log('- unsubscribe');
		timerSub.unsubscribe();
	}, 2000);

	setTimeout(() => {
		console.log('- re subscribe');
		timerSub = timer.subscribe(val => {
			console.log('- sending', val);
			dataSubject.next(val);
		});
	}, 4000);

	setTimeout(() => {
		console.log('- unsubscribe');
		timerSub.unsubscribe();
	}, 4900);
};
