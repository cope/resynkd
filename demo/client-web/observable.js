// IMPORTANT - if you make changes here, always run: yarn build
// The file observable-bundle.js is used in your browser, not this file!
// See https://github.com/browserify/browserify for more info.

const socket = new WebSocket('ws://localhost:3333/ws');
const socketId = 'web-' + new Date().getTime();

const Subject = require('rxjs').Subject;

const ReSynkd = require('ReSynkd').default;
const resynkd = new ReSynkd();

const webClientSubject = new Subject();
resynkd.addSubject('webClientSubject', webClientSubject);

socket.addEventListener('message', (event) => {
	let message = event.data;

	let consumed = resynkd.message(message, socket.send.bind(socket));

	if (!consumed) {
		message = JSON.parse(message);
		console.log('[WS] Web Client received non-resynkd message:', message);
		if (message.registered === true) {
			socket.send(JSON.stringify({
					socketId: socketId,
					type: 'pleaseObserveMe',
					subjectId: 'webClientSubject',
				}),
			);
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

// Send dummy next values:
const r = (i, x) => parseInt(Math.random() * (x - i) + i, 10);
let interval = 0;
const dummy = () => {
	const nextMessage = { after: interval, value: new Date().getTime() };
	console.log('[WS] SENDING webClientSubject next', nextMessage);
	webClientSubject.next(nextMessage);

	interval = r(500, 4500);
	setTimeout(dummy, interval);
};
dummy();
