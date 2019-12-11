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
const dataWatchA = dataSubject.subscribe(val => console.log('A recived:', val));
const dataWatchB = dataSubject.subscribe(val => console.log('B recived:', val));
dataSubject.next('Hello');

const timer = rxjs.interval(1000);
let timerSub = timer.subscribe(val => {
	console.log(val);
	dataSubject.next('sending ' + val);
});
setTimeout(() => timerSub.unsubscribe(), 3000);
// setTimeout(() => timerSub = timer.subscribe(val => console.log(val)), 10000);

const socket = new WebSocket("ws://localhost:1337/ws");

socket.onopen  = (e) => {
	console.log('[open] Connection established');
	socket.send('hi from client');
};

socket.onmessage = (e) => console.log(`[message] Data received from server: ${e.data}`);

socket.onclose = (e) => {
	if (e.wasClean) {
		console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);

	} else {
		// e.g. server process killed or network down
		// event.code is usually 1006 in this case
		console.log('[close] Connection died');
	}
};

socket.onerror = (err) => console.error(`[error] ${err.message}`);
