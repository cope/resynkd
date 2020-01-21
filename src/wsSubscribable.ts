#!/usr/bin/env node
'use strict';

import {Observable, Subscription} from 'rxjs';

export default class wsSubscribable {
	private _subscriptions = new Map<string, Subscription>();

	subscribe(observableId: string): Subscription {
		let observable = new Observable();
		let subscription = observable.subscribe();

		// TODO: store observable to call next on we incomming value

		return subscription;
	}

	unsubscribe(observableId: string): wsSubscribable {
		let subscription = this._subscriptions.get(observableId);
		this._subscriptions.delete(observableId);
		if (subscription) subscription.unsubscribe();
		return this;
	}

}
