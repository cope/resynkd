import {expect} from 'chai';

import {AsyncSubject, BehaviorSubject, ReplaySubject, Subject} from "rxjs";

import ReSynkd from "../src/resynkd";
import RsObserver from "../src/rsObserver";
import RsObservable from '../src/rsObservable';
import RsSubscriber from "../src/rsSubscriber";
import RsMessage from '../src/rsMessage';

describe('All classes exists', () => {
	it('Classes should exist', () => {
		expect(ReSynkd).to.exist;
		expect(RsObserver).to.exist;
		expect(RsObservable).to.exist;
		expect(RsSubscriber).to.exist;
		expect(RsMessage).to.exist;
	});
});

const resynkd1 = new ReSynkd();
const resynkd2 = new ReSynkd();

const subject1 = new Subject();
const subject2 = new BehaviorSubject(0);
const subject3 = new ReplaySubject();
const subject4 = new AsyncSubject();

resynkd1.addSubject('subject1', subject1);
resynkd1.addSubject('subject2', subject2);
resynkd1.addSubject('subject3', subject3);
resynkd1.addSubject('subject4', subject4);

function send1to2(msg: string) {
	resynkd2.message(msg, send2to1);
}

function send2to1(msg: string) {
	resynkd1.message(msg, send1to2);
}

const collect: number[] = [];
const receiver1 = {
	socketId: 'receiver1',
	next: (value: any) => {
		collect.push(value);
	}
};

resynkd2.subscribe({
	...receiver1,
	subjectId: 'subject1',
	send: send2to1,
	observer: {
		next: receiver1.next
	}
});

subject1.next(1);
subject1.complete();

describe('ReSynkd tests', () => {
	describe('endPoint1 tests', () => {
		it('Classes should exist', () => {
			expect(collect).to.deep.equal([1]);
		});
	});
});