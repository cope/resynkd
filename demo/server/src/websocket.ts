#!/usr/bin/env node
'use strict';

import ReSynkd from 'resynkd';
import { SocketStream } from 'fastify-websocket';

import { Subject } from 'rxjs';

const mySub = new Subject();
const resynkd = new ReSynkd();
resynkd.addSubject('mySub', mySub);

export default (connection: SocketStream) => {
	console.log('[WS] Client connected.');

	const { socket } = connection;
	socket.on('message', async message => {
		const consumed = resynkd.message(message, socket.send.bind(socket));
		if (!consumed) {
			message = JSON.parse(message);
			console.log(' - server received non-resynkd message:', JSON.stringify(message));

			if (message.type === 'register') {
				console.log('registering', message.socketId);
				socket.id = message.socketId;
				socket.send(JSON.stringify({ registered: true }));
			}
		}
	});
};

// Send dummy next values:
const r = (i, x) => parseInt(Math.random() * (x - i) + i, 10);
let interval = 0;
const dummy = () => {
	const nextMessage = { after: interval, value: new Date().getTime() };
	console.log('mySub next', nextMessage);
	mySub.next(nextMessage);

	interval = r(500, 4500);
	setTimeout(dummy, interval);
};
dummy();
