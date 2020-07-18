// IMPORTANT - if you make changes here, always run: yarn build
// The file observer-bundle.js is used in your browser, not this file!
// See https://github.com/browserify/browserify for more info.

const socket = new WebSocket('ws://localhost:3333/ws');
const socketId = 'web-' + new Date().getTime();

const ReSynkd = require('ReSynkd').default;
const resynkd = new ReSynkd();

socket.addEventListener('message', (event) => {
	let message = event.data;

	let consumed = resynkd.message(message, socket.send.bind(socket));

	if (!consumed) {
		message = JSON.parse(message);
		console.log('[WS] Web Client received non-resynkd message:', message);
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
});

socket.addEventListener('open', (event) => {
	console.log('[WS] Web Client connected.');
	socket.send(JSON.stringify({
			socketId: socketId,
			type: 'register',
			msg: 'Hello Server from web.',
		}),
	);
});
socket.addEventListener('closed', (event) => socket.send('Closed?'));
socket.addEventListener('error', (event) => socket.send('Error?'));
