'use strict';

const lowdb = require('lowdb');
const LocalStorage = require('../node_modules/lowdb/adapters/LocalStorage');

module.exports = function (n) {
	console.log('\n...demo-lowdb');

	const adapter = new LocalStorage('db');
	const db = lowdb(adapter);

	db.defaults({
		puppies: [{id: 1, title: 'one'}],
		user: {},
		count: 1
	}).write();

	db.get('puppies').push({id: 2, title: 'two'}).write();
	db.update('count', n => n + 1).write();

	console.log('Look at the browsers local storage...');

	setTimeout(() => {
		db.get('puppies').push({id: 3, title: 'three'}).write();
		db.set('count', 3).write();
	}, 2000);

	setTimeout(() => {
		window.localStorage.clear();
		console.log("And now it's gone...");
	}, 4500);
};
