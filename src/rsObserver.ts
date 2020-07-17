'use strict';

import { Subject, Subscription } from 'rxjs';
import RsMessage, { RsMessageType } from './rsMessage';
import { cloneDeep, isString } from 'lodash';
import { RsSubscribe, RsUnsubscribe } from './resynkd.types';

export default class RsObserver {
	private _subjects = new Map<string, Subject<any>>();

	public reset(): void {
		this._subjects = new Map<string, Subject<any>>();
	}

	public subscribe(sub: RsSubscribe): Subscription {
		const { socketId, subjectId, send, observer } = sub;

		const subject = this._getOrCreateSubject(subjectId);
		const subscription = subject.subscribe(observer);

		send(RsMessage('subscribe', socketId, subjectId));
		return subscription;
	}

	public unsubscribe(unsub: RsUnsubscribe): void {
		const { socketId, subjectId, send } = unsub;
		send(RsMessage('unsubscribe', socketId, subjectId));
	}

	public message(message: any, send: (msg: string) => any): boolean {
		let msg = cloneDeep(message);
		if (isString(msg)) {
			try {
				msg = JSON.parse(msg);
			} catch (err) {
				return false;
			}
		}

		if (msg.rsynkd) {
			const { method } = msg.rsynkd;
			switch (method) {
				case 'noSuchObservable':
					return this._noSuchObservable(msg);

				case 'next':
					return this._next(msg);
				case 'error':
					return this._error(msg);
				case 'complete':
					return this._complete(msg);
			}
		}
		return false;
	}

	private _noSuchObservable(msg: RsMessageType): boolean {
		msg.rsynkd.payload = 'No such observable available.';
		return this._error(msg);
	}

	private _next(msg: RsMessageType): boolean {
		const { subjectId, payload } = msg.rsynkd;
		let subject = this._subjects.get(subjectId);
		if (subject) subject.next(payload);
		return true;
	}

	private _error(msg: RsMessageType): boolean {
		const { subjectId, payload } = msg.rsynkd;
		let subject = this._subjects.get(subjectId);
		if (subject) subject.error(payload);
		return true;
	}

	private _complete(msg: RsMessageType): boolean {
		const { subjectId } = msg.rsynkd;
		let subject = this._subjects.get(subjectId);
		if (subject) subject.complete();
		this._subjects.delete(subjectId);
		return true;
	}

	private _getOrCreateSubject(subjectId: string): Subject<any> {
		let subject = this._subjects.get(subjectId);
		if (!subject) {
			subject = new Subject();
			this._subjects.set(subjectId, subject);
		}
		return subject;
	}

}
