#!/usr/bin/env node
'use strict';

import {Observable, Subscription} from 'rxjs';

export default class wsSubscribable {
	private _subscriptions = new Map<string, Subscription>();

	// TODO: maybe use: private _subscribers = new Map<string, wsSubscriber>();

	subscribe(observableId: string): Subscription {
		let observable = new Observable();
		let subscription = observable.subscribe();

		// TODO: store observable to call next on we incomming value

		return subscription;
	}

	message(observableId: string) {
		// TODO...
	}

	unsubscribe(observableId: string): wsSubscribable {
		let subscription = this._subscriptions.get(observableId);
		this._subscriptions.delete(observableId);
		if (subscription) subscription.unsubscribe();
		return this;
	}

}
