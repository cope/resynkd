#!/usr/bin/env node
'use strict';

import {cloneDeep, isString} from 'lodash';
import {Observable, Subscription} from 'rxjs';

import wsMessage from './wsMessage';

export default class wsObservable {
	private _observables = new Map<string, Observable<any>>();
	private _subscribers = new Map<string, wsSubscriber>();

	addObservable(observableId: string, observable: Observable<any>): boolean {
		if (this._observables.has(observableId)) return false;
		this._observables.set(observableId, observable);
		return true;
	}

	message(socketId: string, message: any, respond: (n: any) => any): wsObservable {
		let msg = cloneDeep(message);
		if (isString(message)) msg = JSON.parse(message);

		if (msg.rsynkd) {
			const {observableId, method} = msg.rsynkd;

			if ('subscribe' === method.toLowerCase()) {
				this._subscribe(socketId, observableId, respond);

			} else if ('unsubscribe' === method.toLowerCase()) {
				this._unsubscribe(socketId, observableId);
			}
		}
		return this;
	}

	private _subscribe(socketId: string, observableId: string, respond: (n: any) => any) {
		let observable = this._observables.get(observableId);
		if (!observable) return respond('does not exist');

		let subscription = observable.subscribe({
			next: (value) => {
				respond(wsMessage(socketId, observableId, value));
			}
		});
		let subscriber = new wsSubscriber();
		if (subscriber.subscribe(observableId, subscription)) {
			this._subscribers.set(socketId, subscriber);

		} else {
			respond(wsMessage(socketId, observableId, {error: `Socket ${socketId} already subscribed to ${observableId} observable.`}));
		}
	}

	private _unsubscribe(socketId: string, observableId: string): wsObservable {
		let subscriber = this._subscribers.get(socketId);
		if (subscriber) {
			subscriber.unsubscribe(observableId);
			this._subscribers.delete(socketId);
		}
		return this;
	}

}

class wsSubscriber {
	private _subscriptions = new Map<string, Subscription>();

	subscribe(observableId: string, subscription: Subscription): boolean {
		if (this._subscriptions.has(observableId)) return false;
		this._subscriptions.set(observableId, subscription);
		return true;
	}

	unsubscribe(observableId: string): wsSubscriber {
		let subscription = this._subscriptions.get(observableId);
		if (subscription) {
			subscription.unsubscribe();
			this._subscriptions.delete(observableId);
		}
		return this;
	}

}
