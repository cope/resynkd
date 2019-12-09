'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');
const lowdb = require('lowdb');
const LocalStorage = require('./node_modules/lowdb/adapters/LocalStorage');

const adapter = new LocalStorage('db');
const db = lowdb(adapter);

db.defaults({
	posts: [],
	user: {},
	count: 1
}).write();

db.get('posts')
	.push({id: 3, title: 'lowdb'})
	.write();

const tmp = require('./src/tmp');

console.log(_.range(6));
console.log(tmp(6));

// setTimeout(() => {
// 	window.localStorage.clear();
// }, 5000);
