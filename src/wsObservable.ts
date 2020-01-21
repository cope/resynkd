#!/usr/bin/env node
'use strict';

import {Observable} from 'rxjs';
import wsSubscriber from './wsSubscriber';

export default class wsObservable {
	private _observables = new Map<string, Observable<any>>();
	private _subscribers = new Map<string, wsSubscriber>();

	constructor() {
	}

	observable(observableId: string, observable: Observable<any>): wsObservable {
		this._observables.set(observableId, observable);
		return this;
	}

	unsubscribe(socketId: string, observableId: string): wsObservable {
		let subscriber = this._subscribers.get(socketId);
		if (subscriber) {
			subscriber.unsubscribe(observableId);
			this._subscribers.delete(socketId);
		}
		return this;
	}

	message(message: string, send: (n: any) => any): wsObservable {
		let obj = JSON.parse(message);
		if (obj.rsynkd) {
			const {id, socketId, data} = obj.rsynkd;
			let observable = this._observables.get(id);
			if (!observable) return send('does not exist');

			let subscription = observable.subscribe({
				next: (value) => {
					// TODO...
					let msg = {rsynkd: {id, message: JSON.stringify(value)}};
					send(msg);
				}
			});
			let subscriber = new wsSubscriber().subscribe(id, subscription);
			this._subscribers.set(socketId, subscriber);
		}
		return this;
	}

}
