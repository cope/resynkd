'use strict';

const _ = require('lodash');

const onError = (err) => console.error(`[error] ${err.message}`);
const onOpen = (e) => ({});
const onClose = (e) => {
	if (e.wasClean) console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
	else console.log('[close] Connection died');

	// reconnect?
};

module.exports = function (url) {
	const socket = new WebSocket(url);
	// socket.send({msg: 'hi from client'});

	socket.onopen = onOpen;
	socket.onclose = onClose;
	socket.onerror = onError;

	socket.onmessage = (e) => {
		let {data} = e;
		console.log(`[message] Data received from server: ${data}`);
		// process message!
	}
};
