'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');

console.log('rxjs', rxjs);
console.log('range', _.range(6));

const demoSqlJs = require('./demo-sqljs');
const demoObservable = require('./demo-observable');
const demoSubject = require('./demo-subject');
const demoWebsocket = require('./demo-websocket');
const demoWebsocketSubject = require('./demo-websocket-subject');

module.exports = function (n) {
	setTimeout(() => demoSqlJs(), 100);
	setTimeout(() => demoObservable(), 5000);
	setTimeout(() => demoSubject(), 10000);
	setTimeout(() => demoWebsocket(), 15000);
	setTimeout(() => demoWebsocketSubject(), 17000);
};