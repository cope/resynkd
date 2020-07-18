// IMPORTANT - run: yarn build
// And then use browserified.js in your browser, instead of this file! See https://github.com/browserify/browserify for more info

var ReSynkd = require('ReSynkd').default;
const resynkd = new ReSynkd();

const socketId = new Date().getTime();
const socket = new WebSocket('ws://localhost:3333/ws');

socket.addEventListener('message', (event) => {
	let message = event.data;
	let consumed = resynkd.message(message, socket.send.bind(socket));
	if (!consumed) {
		message = JSON.parse(message);
		console.log(' - client received non-resynkd message:', message);
		if (message.registered === true) {
			resynkd.subscribe({
				socketId: socketId,
				subjectId: 'mySub',
				send: socket.send.bind(socket),
				observer: {
					next: (value) => {   // * required!
						console.log('[ReSynkd] received next message:', value);
					},
					error: (err) => {   // * optional
						console.error('[ReSynkd] error', err);
					},
					complete: () => {   // * optional
						console.error('[ReSynkd] Subject completed.');
					},
				},
			});
		}
	}
});

socket.addEventListener('open', (event) => {
	console.log('[WS] Client connected.');
	socket.send(JSON.stringify({ socketId: socketId, type: 'register', msg: 'Hello Server!' }));
});
socket.addEventListener('closed', (event) => socket.send('Closed?'));
socket.addEventListener('error', (event) => socket.send('Error?'));
