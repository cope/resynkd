'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');
const lowdb = require('lowdb');
const LocalStorage = require('./node_modules/lowdb/adapters/LocalStorage');

const adapter = new LocalStorage('db');
const db = lowdb(adapter);

db.defaults({
		puppies: [],
		user: {},
		count: 1
	})
	.write();

// db.get('puppies')
// 	.push({id: 3, title: 'lowdb'})
// 	.write();

const tmp = require('./src/tmp');

console.log(_.range(6));
console.log(tmp(6));
console.log(rxjs);

// setTimeout(() => {
// 	window.localStorage.clear();
// }, 5000);

const dataSubject = new rxjs.Subject();
const dataWatchA = dataSubject.subscribe(val => console.log('A:', val));
const dataWatchB = dataSubject.subscribe(val => console.log('B:', val));
dataSubject.next('Hello');

const timer = rxjs.interval(1000);
let timerSub = timer.subscribe(val => {
	console.log(val);
	dataSubject.next(val);
});
setTimeout(() => timerSub.unsubscribe(), 5000);
// setTimeout(() => timerSub = timer.subscribe(val => console.log(val)), 10000);


