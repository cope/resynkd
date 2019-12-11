'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');

const tmp = require('./src/tmp');

console.log('rxjs', rxjs);
console.log('range', _.range(6));
console.log('tmp', tmp(6));

const demoLowDB = require('./demo/demo-lowdb');
const demoObservable = require('./demo/demo-observable');
const demoSubject = require('./demo/demo-subject');
const demoWebsocket = require('./demo/demo-websocket');
const demoWebsocketSubject = require('./demo/demo-websocket-subject');

setTimeout(() => demoLowDB(), 100);
setTimeout(() => demoObservable(), 5000);
setTimeout(() => demoSubject(), 10000);
setTimeout(() => demoWebsocket(), 15000);
setTimeout(() => demoWebsocketSubject(), 17000);
