#!/usr/bin/env node
'use strict';
import { Subject } from 'rxjs';
import { SocketStream } from 'fastify-websocket';

import ReSynkd from 'resynkd';

const resynkd = new ReSynkd();

const serverSubject = new Subject();
resynkd.addSubject('serverSubject', serverSubject);

export default (connection: SocketStream) => {
	console.log('[WS] Client connected.');

	const { socket } = connection;
	socket.on('message', async message => {

		const consumed = resynkd.message(message, socket.send.bind(socket));

		if (!consumed) {
			message = JSON.parse(message);
			console.log('[WS] Server received non-resynkd message:', JSON.stringify(message));

			if (message.type === 'register') {
				console.log('[WS] registering', message.socketId);
				socket.id = message.socketId;
				socket.send(JSON.stringify({ registered: true }));
			}

			if (message.type === 'pleaseObserveMe') {
				console.log('[WS] Server received a request to observe', message.subjectId);
				resynkd.subscribe({
					socketId: socket.id,
					subjectId: message.subjectId,
					send: socket.send.bind(socket),
					observer: {
						next: (value) => {   // * required!
							console.log('[ReSynkd] RECEIVED', '[' + message.subjectId + ']', 'next message:', value);
						},
						error: (err) => {   // * optional
							console.error('[ReSynkd] RECEIVED', '[' + message.subjectId + ']', 'error', err);
						},
						complete: () => {   // * optional
							console.error('[ReSynkd] RECEIVED', '[' + message.subjectId + ']', 'completed.');
						},
					},
				});
			}
		}
	});

	socket.on('close', () => console.log('[WS] Client disconnected.'));
};

// Send dummy next values:
const r = (i, x) => parseInt(Math.random() * (x - i) + i, 10);
let interval = 0;
const dummy = () => {
	const nextMessage = { after: interval, value: new Date().getTime() };
	console.log('[WS] SENDING serverSubject next', nextMessage);
	serverSubject.next(nextMessage);

	interval = r(500, 4500);
	setTimeout(dummy, interval);
};
dummy();
