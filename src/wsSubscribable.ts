#!/usr/bin/env node
'use strict';

import {Subscription} from 'rxjs';

export default class wsSubscribable {
	private _subscriptions = new Map<string, Subscription>();

	subscribe(observableId: string, subscription: Subscription): wsSubscribable {
		this._subscriptions.set(observableId, subscription);
		return this;
	}

	unsubscribe(observableId: string): wsSubscribable {
		let subscription = this._subscriptions.get(observableId);
		this._subscriptions.delete(observableId);
		if (subscription) subscription.unsubscribe();
		return this;
	}

}
