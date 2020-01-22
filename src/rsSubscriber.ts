#!/usr/bin/env node
'use strict';

import {Subject, Subscription} from 'rxjs';
import RsMessage from "./rsMessage";

export default class RsSubscriber {
	private _id: string;
	private _send: (msg: string) => any;
	private _subscriptions = new Map<string, Subscription>();

	constructor(socketId: string, send: (msg: string) => any) {
		this._id = socketId;
		this._send = send;
	}

	public subscribe(subjectId: string, subject: Subject<any>): boolean {
		if (this._subscriptions.has(subjectId)) throw new Error("Subscription already exists.");
		const subscription = subject.subscribe({
			next: (value) => this._send(RsMessage('next', this._id, subjectId, value)),
			error: (err) => this._send(RsMessage('error', this._id, subjectId, err)),
			complete: () => this._send(RsMessage('complete', this._id, subjectId))
		});
		this._subscriptions.set(subjectId, subscription);
		return true;
	}

	public unsubscribe(subjectId: string): RsSubscriber {
		let subscription = this._subscriptions.get(subjectId);
		if (subscription) subscription.unsubscribe();
		this._subscriptions.delete(subjectId);
		return this;
	}

	public isEmpty(): boolean {
		return this._subscriptions.size === 0;
	}
}
