#!/usr/bin/env node
'use strict';

import {NextObserver, Observable} from 'rxjs';
import wsSubscribable from './wsSubscribable';

export default class wsObservable {
	private _observables = new Map<string, Observable<any>>();
	private _subscribers = new Map<string, wsSubscribable>();

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
			let subscriber = new wsSubscribable().subscribe(id, subscription);
			this._subscribers.set(socketId, subscriber);
		}
		return this;
	}

}

class wsObserver {
	private _subscriptions = new Map<string, NextObserver<(value: any) => void>>();

	constructor() {
	}

	subscription(id: string, nextObserver: NextObserver<(value: any) => void>): wsObserver {
		this._subscriptions.set(id, nextObserver);
		return this;
	}

	message(message: string, send: (n: string) => any): wsObserver {

		return this;
	}
}
