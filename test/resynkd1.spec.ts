#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import {Subject} from "rxjs";
import ReSynkd from "../src/resynkd";

describe('ReSynkd tests', () => {
	it('ReSynkd should exist', () => expect(ReSynkd).to.exist);
});

describe('ReSynkd Subject tests', () => {
	const resynkd = new ReSynkd();

	const subject1_1 = new Subject();
	resynkd.addSubject('subject1_1', subject1_1);

	function rs1_from1to2(msg: string) {
		resynkd.message(msg, rs1_from2to1);
	}

	function rs1_from2to1(msg: string) {
		resynkd.message(msg, rs1_from1to2);
	}

	const collect1: number[] = [];
	const receiver1 = {
		socketId: 'receiver1',
		next: (value: any) => {
			collect1.push(value);
		}
	};

	resynkd.subscribe({
		...receiver1,
		subjectId: 'subject1_1',
		send: rs1_from2to1,
		observer: {
			next: receiver1.next,
			error: (err) => ({})
		}
	});

	resynkd.subscribe({
		...receiver1,
		subjectId: 'subject1_1b',
		send: rs1_from2to1,
		observer: {
			next: (value) => console.log('\nNext [subject1_1b]:', value),
			error: (err) => console.log('\nError [subject1_1b]:', err),
			complete: () => console.log('\nComplete [subject1_1b]')
		}
	});

	subject1_1.next(1);
	subject1_1.next(2);
	subject1_1.error("oops");

	resynkd.unsubscribe({
		...receiver1,
		subjectId: 'subject1_1',
		send: rs1_from2to1,
	});

	it('Subject values should be correct', () => {
		expect(collect1).to.deep.equal([1, 2]);
		expect(resynkd.message('yei', (msg) => console.log)).to.equal(false);
	});
	it('Double subscription should fail', () => {
		expect(() => resynkd.addSubject('subject1_1', subject1_1)).to.throw;
		expect(() => resynkd.subscribe({
			...receiver1,
			subjectId: 'subject1_1',
			send: rs1_from2to1,
			observer: {next: receiver1.next}
		})).to.throw;
	});
});