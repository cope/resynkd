'use strict';

import {cloneDeep, isString} from 'lodash';
import RsMessage, {RsMessageType} from './rsMessage';
import RsSubscriber from "./rsSubscriber";
import {RsSubject} from "./resynkd.types";

export default class RsObservable {
	private _subjects: Map<string, RsSubject<any>> = new Map<string, RsSubject<any>>();
	private _subscribers: Map<string, RsSubscriber> = new Map<string, RsSubscriber>();

	public reset(): void {
		this._subjects = new Map<string, RsSubject<any>>();
		this._subscribers = new Map<string, RsSubscriber>();
	}

	public addSubject(subjectId: string, subject: RsSubject<any>): boolean {
		if (this._subjects.has(subjectId)) throw new Error("Subject already exists.");
		this._subjects.set(subjectId, subject);
		return true;
	}

	public message(message: any, send: (msg: string) => any): boolean {
		let msg = cloneDeep(message);
		if (isString(msg)) {
			try {
				msg = JSON.parse(msg);
			} catch (err) {
			}
		}

		if (msg.rsynkd) {
			const {method} = msg.rsynkd;
			switch (method) {
				case 'subscribe':
					return this._subscribe(msg, send);
				case 'unsubscribe':
					return this._unsubscribe(msg);
			}
		}

		return false;
	}

	public removeSubscriber(socketId: string): boolean {
		this._subscribers.delete(socketId);
		return true;
	}

	private _getOrCreateSubscriber(socketId: string, send: (msg: string) => any) {
		let subscriber = this._subscribers.get(socketId);
		if (subscriber) return subscriber;
		return new RsSubscriber(socketId, send);
	}

	private _subscribe(msg: RsMessageType, send: (msg: string) => any): boolean {
		const {socketId, subjectId} = msg.rsynkd;

		let subject = this._subjects.get(subjectId);
		if (!subject) {
			send(RsMessage('noSuchObservable', socketId, subjectId));

		} else {
			let subscriber = this._getOrCreateSubscriber(socketId, send);
			try {
				subscriber.subscribe(subjectId, subject);

			} catch (err) {
				send(RsMessage('error', socketId, subjectId, {
					error: `The socket:${socketId} already subscribed to subject:${subjectId}.`
				}));
			}
		}

		return true;
	}

	private _unsubscribe(msg: RsMessageType): boolean {
		const {socketId, subjectId} = msg.rsynkd;

		let subscriber = this._subscribers.get(socketId);
		if (subscriber) subscriber.unsubscribe(subjectId);

		return true;
	}

}
