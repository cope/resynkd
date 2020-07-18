const ReconnectingWebSocket = require('reconnecting-websocket');
const webSocketOptions = {
	WebSocket: require('ws'),
	connectionTimeout: 1000,
	maxRetries: 10,
};
const socket = new ReconnectingWebSocket('ws://localhost:3333/ws', [], webSocketOptions);
const socketId = 'node-' + new Date().getTime();

const Subject = require('rxjs').Subject;

const ReSynkd = require('ReSynkd').default;
const resynkd = new ReSynkd();

const nodejsClientSubject = new Subject();
resynkd.addSubject('nodejsClientSubject', nodejsClientSubject);

socket.onmessage = (e) => {
	let { data: message } = e;

	let consumed = resynkd.message(message, socket.send.bind(socket));

	if (!consumed) {
		message = JSON.parse(message);
		console.log('[WS] Node Client received non-resynkd message:', message);
		if (message.registered === true) {
			socket.send(JSON.stringify({
					socketId: socketId,
					type: 'pleaseObserveMe',
					subjectId: 'nodejsClientSubject',
				}),
			);
		}
	}
};

socket.onopen = async (e) => {
	console.log('[WS] Node Client connected.');
	socket.send(JSON.stringify({
			socketId: socketId,
			type: 'register',
			msg: 'Hello Server from NodeJS.',
		}),
	);
};
socket.onerror = (err) => console.error(`[error] ${err.message}`);
socket.onclose = (e) => {
	if (e.wasClean) console.log(`[WS] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
	else console.log('[WS] Node Connection died');
};

// Send dummy next values:
const r = (i, x) => parseInt(Math.random() * (x - i) + i, 10);
let interval = 0;
const dummy = () => {
	const nextMessage = { after: interval, value: new Date().getTime() };
	console.log('[WS] SENDING nodejsClientSubject next', nextMessage);
	nodejsClientSubject.next(nextMessage);

	interval = r(500, 4500);
	setTimeout(dummy, interval);
};
dummy();
