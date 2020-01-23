#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import {AsyncSubject} from "rxjs";
import ReSynkd from "../src/resynkd";

describe('ReSynkd AsyncSubject tests', () => {
	const resynkd = new ReSynkd();

	const subject4_4 = new AsyncSubject();
	resynkd.addSubject('subject4_4', subject4_4);

	function rs4_from1to2(msg: string) {
		resynkd.message(msg, rs4_from2to1);
	}

	function rs4_from2to1(msg: string) {
		resynkd.message(msg, rs4_from1to2);
	}

	const collect4: number[] = [];
	const receiver4 = {
		socketId: 'receiver4',
		next: (value: any) => {
			collect4.push(value);
		}
	};

	subject4_4.next(1);

	resynkd.subscribe({
		...receiver4,
		subjectId: 'subject4_4',
		send: rs4_from2to1,
		observer: {
			next: receiver4.next
		}
	});

	subject4_4.next(2);
	subject4_4.next(3);
	subject4_4.complete();

	resynkd.unsubscribe({
		...receiver4,
		subjectId: 'subject4_4',
		send: rs4_from2to1,
	});

	it('AsyncSubject values should be correct', () => {
		expect(collect4).to.deep.equal([3]);
	});
});