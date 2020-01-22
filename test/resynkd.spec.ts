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

const subject1 = new AsyncSubject();
const subject2 = new BehaviorSubject(0);
const subject3 = new ReplaySubject();
const subject4 = new Subject();

const collect1: number[] = [];
const receiver = {
	socketId: 'endPoint1',
	send: (value: any) => {
		console.log('\n - receiver::send', value);
	},
	next: (value: any) => {
		console.log('\n - receiver::next', value);
		collect1.push(value);
	}
};

const sender = {
	socketId: 'endPoint2',
	send: (value: any) => {
		console.log('\n - sender::send', value);
		receiver.next(value);
	},
	next: (value: any) => {
		console.log('\n - sender::next', value);
	}
};

const resynkd = new ReSynkd();
resynkd.addSubject('subject1', subject1);
resynkd.addSubject('subject2', subject2);
resynkd.addSubject('subject3', subject3);
resynkd.addSubject('subject4', subject4);

resynkd.subscribe({
	...sender,
	subjectId: 'subject1',
	observer: {
		next: sender.send
	}
});

subject1.next(1);

describe('ReSynkd tests', () => {
	describe('endPoint1 tests', () => {
		it('Classes should exist', () => {
			expect(collect1).to.deep.equal([1]);
		});
	});
});