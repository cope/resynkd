'use strict';

module.exports = function () {
	console.log('\n...demo-websocket');

	const socket = new WebSocket("ws://localhost:1337/ws");
	socket.onopen = (e) => {
		console.log('[open] Connection established');
		socket.send({msg: 'hi from client'});
	};
	socket.onmessage = (e) => console.log(`[message] Data received from server: ${e.data}`);
	socket.onclose = (e) => {
		if (e.wasClean) console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
		else console.log('[close] Connection died');
	};
	socket.onerror = (err) => console.error(`[error] ${err.message}`);
};
