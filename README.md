<a href="https://cope.github.io/resynkd/">
  <img alt="resynkd" src="https://raw.githubusercontent.com/cope/resynkd/master/resynkd.jpg" width="100">
</a>

# resynkd
[![build status](https://img.shields.io/travis/cope/resynkd.svg?branch=master)](https://travis-ci.org/cope/resynkd)
[![codacy](https://img.shields.io/codacy/grade/688be689cad640b89d180b8fee850df7.svg)](https://www.codacy.com/project/cope/resynkd/dashboard)
[![coverage](https://img.shields.io/coveralls/github/cope/resynkd/master.svg)](https://coveralls.io/github/cope/resynkd?branch=master)
[![dependencies](https://david-dm.org/cope/resynkd.svg)](https://www.npmjs.com/package/resynkd)
[![npm](https://img.shields.io/npm/dt/resynkd.svg)](https://www.npmjs.com/package/resynkd)

Observable pattern through WebSockets.

### Motivation

ReSynkd puts together the amazing [RxJS library](https://rxjs.dev) and the [WebSocket protocol](https://en.wikipedia.org/wiki/WebSocket).

Although [RxJS](https://rxjs.dev) provides the [WebSocketSubject](https://rxjs.dev/api/webSocket/WebSocketSubject) class,
it seems that anyone can subscribe to but also send through the same webSocketSubject, which I did not like.
I wanted a way to put an Observable on the server and subscribe to it from the clients, but also vice versa.

### Documentation

The typedoc documentation is available at https://cope.github.io/resynkd/docs/

### Demo

See the `./demo/` folder in this repo.

### Usage

Keep in mind that the `socketsSendMethod` is a placeholder for whatever the `send` method is in the websocket implementation used,
and thus this function varies.
Most often it is simply `socket.send`, as is in the demo, but it can also be `connection.socket.send` or `e.target.send`, and so on.

Endpoint1 (Observable)
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
socket.onmessage(message => {
	let consumed = resynkd.message(message, socketsSendMethod.bind(socket));	// IMPORTANT: don't forget to bind!
	if(!consumed) console.log(message); // ...handle non-resynkd messages...
});

const subject = new Subject();
resynkd.addSubject('unique_subject_name', subject);
subject.next('value 1');
subject.next('value 25');
subject.next('value 17');
// etc.
```

Endpoint2 (Observer)
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
socket.onmessage(message => {
	let consumed = resynkd.message(message, socketsSendMethod.bind(socket));	// IMPORTANT: don't forget to bind!
	if(!consumed) console.log(message); // ...handle non-resynkd messages...
});

resynkd.subscribe({
	socketId: 'socket-id',					  // must be same value on both socket endpoints
	subjectId: 'unique_subject_name',		  
	send: socketsSendMethod.bind(socket),		// IMPORTANT: don't forget to bind!
	observer: {
		next: (value) => {   // * required!
			// handle value...
		},
		error: (err) => {   // * optional
			// handle error...
		},
		complete: () => {   // * optional
			// handle complete...
		}
   	}
});
```

#### The on message processing 

The main part of any websocket communication is the `on message` event.
Whether it is `socket.on('message', ...`, or `socket.addEventListener('message', ...`,
in either case, the handler method receives the websocket message and it must include the resynkd processing in it.
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
let handler = (message) => {
	let consumed = resynkd.message(message, socketsSendMethod.bind(socket));	// IMPORTANT: don't forget to bind!
	if(!consumed) console.log(message); // ...handle non-resynkd messages...
}
```

Putting it all together, the most common example looks like below...

##### Server side (using fastify)
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
fastify.get('/ws', {websocket: true}, (connection, req) => {
	connection.socket.on('message', message => {
		let consumed = resynkd.message(message, connection.socket.send.bind(connection.socket));   // IMPORTANT: don't forget to bind!
		if(!consumed) console.log(message); // ...handle non-resynkd messages...
	});
});
```

##### Client side
```javascript
const ReSynkd = require('resynkd');
const resynkd = new ReSynkd();

let socket = new WebSocket(YOUR_WS_URI);
socket.onmessage = (e) => {
	let { data: message } = e;
	let consumed = resynkd.message(message, e.target.send.bind(e.target));	 // IMPORTANT: don't forget to bind!
	if(!consumed) console.log(message); // ...handle non-resynkd messages...
};
```
