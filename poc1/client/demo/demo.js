'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');

console.log('rxjs', rxjs);
console.log('range', _.range(6));

const demoRedux = require('./demo-redux');
const demoObservable = require('./demo-observable');
const demoSubject = require('./demo-subject');
const demoWebsocket = require('./demo-websocket');
const demoWebsocketSubject = require('./demo-websocket-subject');

const demos = [
	demoRedux,
	demoObservable,
	demoSubject,
	demoWebsocket,
	demoWebsocketSubject
];

const delay = 5000;
module.exports = function (n) {
	let cnt = 0;
	_.each(demos, demo => setTimeout(() => demo(), (delay * cnt++)));
};