#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import {ReplaySubject} from "rxjs";
import ReSynkd from "../src/resynkd";

describe('ReSynkd3 tests', () => {
	describe('endPoint3 tests', () => {
		const resynkd = new ReSynkd();

		const subject3_3 = new ReplaySubject();
		resynkd.addSubject('subject3_3', subject3_3);

		function rs3_from1to2(msg: string) {
			resynkd.message(msg, rs3_from2to1);
		}

		function rs3_from2to1(msg: string) {
			resynkd.message(msg, rs3_from1to2);
		}

		const collect3: number[] = [];
		const receiver3 = {
			socketId: 'receiver3',
			next: (value: any) => {
				collect3.push(value);
			}
		};

		subject3_3.next(1);
		subject3_3.next(2);
		subject3_3.next(3);

		resynkd.subscribe({
			...receiver3,
			subjectId: 'subject3_3',
			send: rs3_from2to1,
			observer: {
				next: receiver3.next
			}
		});

		subject3_3.next(4);
		subject3_3.complete();

		resynkd.unsubscribe({
			...receiver3,
			subjectId: 'subject3_3',
			send: rs3_from2to1,
		});

		it('Values should be correct', () => {
			expect(collect3).to.deep.equal([1, 2, 3, 4]);
		});
	});
});