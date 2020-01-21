#!/usr/bin/env node
'use strict';

import {Subscription} from 'rxjs';

export default class wsSubscriber {
	private _subscriptions = new Map<string, Subscription>();

	subscribe(observableId: string, subscription: Subscription): wsSubscriber {
		this._subscriptions.set(observableId, subscription);
		return this;
	}

	unsubscribe(observableId: string): wsSubscriber {
		let subscription = this._subscriptions.get(observableId);
		this._subscriptions.delete(observableId);
		if (subscription) subscription.unsubscribe();
		return this;
	}

}
