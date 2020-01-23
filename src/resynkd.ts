#!/usr/bin/env node
'use strict';

// -------------
// NAMESPACE: Rs
// -------------

import RsObserver from './rsObserver';
import RsObservable from './rsObservable';
import {Subject, Subscription} from "rxjs";
import {RsSubscribe, RsUnsubscribe} from "./resynkd.types";

export {RsSubscribe, RsUnsubscribe}

export default class ReSynkd {
	private _observer: RsObserver;
	private _observable: RsObservable;

	constructor() {
		this._observer = new RsObserver();
		this._observable = new RsObservable();
	}

	public message(message: any, send: (msg: string) => any): boolean {
		if (this._observer.message(message, send)) return true;
		return this._observable.message(message, send);
	}

	public addSubject(subjectId: string, subject: Subject<any>): boolean {
		return this._observable.addSubject(subjectId, subject);
	}

	public subscribe(sub: RsSubscribe): Subscription {
		return this._observer.subscribe(sub);
	}

	public unsubscribe(unsub: RsUnsubscribe): void {
		this._observer.unsubscribe(unsub);
	}

}