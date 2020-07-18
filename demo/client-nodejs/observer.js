const ReconnectingWebSocket = require('reconnecting-websocket');
const webSocketOptions = {
	WebSocket: require('ws'),
	connectionTimeout: 1000,
	maxRetries: 10,
};
const socket = new ReconnectingWebSocket('ws://localhost:3333/ws', [], webSocketOptions);
const socketId = 'node-' + new Date().getTime();

const ReSynkd = require('ReSynkd').default;
const resynkd = new ReSynkd();

socket.onmessage = (e) => {
	let { data: message } = e;

	let consumed = resynkd.message(message, socket.send.bind(socket));

	if (!consumed) {
		message = JSON.parse(message);
		console.log('[WS] Node Client received non-resynkd message:', message);
		if (message.registered === true) {
			resynkd.subscribe({
				socketId: socketId,
				subjectId: 'serverSubject',
				send: socket.send.bind(socket),
				observer: {
					next: (value) => {   // * required!
						console.log('[ReSynkd] RECEIVED [serverSubject] next message:', value);
					},
					error: (err) => {   // * optional
						console.error('[ReSynkd] RECEIVED [serverSubject] error', err);
					},
					complete: () => {   // * optional
						console.error('[ReSynkd] RECEIVED [serverSubject] completed.');
					},
				},
			});
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
