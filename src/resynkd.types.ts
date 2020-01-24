'use strict';

import {AsyncSubject, BehaviorSubject, NextObserver, ReplaySubject, Subject} from "rxjs";

export type RsSubject<T> = AsyncSubject<T> | BehaviorSubject<T> | ReplaySubject<T> | Subject<T>;

export type RsMethod =
	'next' | 'error' | 'complete'		// subject lambda methods
	| 'subscribe' | 'noSuchObservable'	// subscriptions communication
	| 'unsubscribe'						// unsubscribe
	;

export type RsMessageType = {
	rsynkd: {
		method: RsMethod,
		socketId: string,
		subjectId: string,
		payload: any,
		messageId: string
	}
}

export type RsSubscribe = {
	socketId: string,
	subjectId: string,
	send: (msg: string) => any,
	observer: NextObserver<any>
};

export type RsUnsubscribe = {
	socketId: string,
	subjectId: string,
	send: (msg: string) => any
};
