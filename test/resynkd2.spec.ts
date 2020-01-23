#!/usr/bin/env node
'use strict';

import {expect} from 'chai';
import {BehaviorSubject} from "rxjs";
import ReSynkd from "../src/resynkd";

describe('ReSynkd2 tests', () => {
	describe('endPoint2 tests', () => {
		const resynkd = new ReSynkd();

		const subject2_2 = new BehaviorSubject(0);
		resynkd.addSubject('subject2_2', subject2_2);

		function rs2_from1to2(msg: string) {
			resynkd.message(msg, rs2_from2to1);
		}

		function rs2_from2to1(msg: string) {
			resynkd.message(msg, rs2_from1to2);
		}

		const collect2: number[] = [];
		const receiver2 = {
			socketId: 'receiver2',
			next: (value: any) => {
				collect2.push(value);
			}
		};

		resynkd.subscribe({
			...receiver2,
			subjectId: 'subject2_2',
			send: rs2_from2to1,
			observer: {
				next: receiver2.next,
				complete: () => ({})
			}
		});

		subject2_2.next(1);
		subject2_2.next(2);
		subject2_2.complete();

		resynkd.unsubscribe({
			...receiver2,
			subjectId: 'subject2_2',
			send: rs2_from2to1,
		});

		it('Values should be correct', () => {
			expect(collect2).to.deep.equal([0, 1, 2]);
		});
	});
});