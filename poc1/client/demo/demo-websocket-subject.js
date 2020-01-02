'use strict';

const webSocket = require('rxjs/webSocket');

module.exports = function () {
	console.log('\n...demo-websocket-subject');

	const wssubject = new webSocket.WebSocketSubject('ws://localhost:1337/ws');
	wssubject.next({message: 'ws message ' + new Date().getTime()});

	const wsobserver = wssubject.subscribe(
		msg => console.log('[RX] message received: ', msg),	// There is a message from the server
		err => console.log('[RX] error', err),				// WebSocket API signals some error
		() => console.log('[RX] completed')					// Connection is closed
	);
};
