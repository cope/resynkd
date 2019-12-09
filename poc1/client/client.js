'use strict';

const _ = require('lodash');
const rxjs = require('rxjs');
const lowdb = require('lowdb');

const tmp = require('./src/tmp');

console.log(_.range(6));
console.log(tmp(6));
