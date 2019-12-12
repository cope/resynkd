'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');

console.log('rxjs', rxjs);
console.log('range', _.range(6));

const demoObservable = require('./demo-observable');
const demoSubject = require('./demo-subject');
const demoWebsocket = require('./demo-websocket');
const demoWebsocketSubject = require('./demo-websocket-subject');

module.exports = function (n) {
	setTimeout(() => demoObservable(), 100);
	setTimeout(() => demoSubject(), 5000);
	setTimeout(() => demoWebsocket(), 10000);
	setTimeout(() => demoWebsocketSubject(), 12000);
};