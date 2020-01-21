#!/usr/bin/env node
'use strict';

import {NextObserver} from 'rxjs';

export default class wsObserver {
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
