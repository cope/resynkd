<a href="https://cope.github.io/resynkd/">
  <img alt="resynkd" src="https://raw.githubusercontent.com/cope/resynkd/master/resynkd.jpg" width="100">
</a>

# resynkd
[![build status](https://img.shields.io/travis/cope/resynkd.svg?branch=master)](https://travis-ci.org/cope/resynkd)
[![codacy](https://img.shields.io/codacy/grade/688be689cad640b89d180b8fee850df7.svg)](https://www.codacy.com/project/cope/resynkd/dashboard)
[![coverage](https://img.shields.io/coveralls/github/cope/resynkd/master.svg)](https://coveralls.io/github/cope/resynkd?branch=master)
[![dependencies](https://david-dm.org/cope/resynkd.svg)](https://www.npmjs.com/package/resynkd)
[![npm](https://img.shields.io/npm/dt/resynkd.svg)](https://www.npmjs.com/package/resynkd)
[![Greenkeeper badge](https://badges.greenkeeper.io/cope/resynkd.svg)](https://greenkeeper.io/)

Client-Server WebSocket Observable pattern implementation.

### Motivation

ReSynkd puts together the amazing [RxJS library](https://rxjs.dev) and the [WebSocket protocol](https://en.wikipedia.org/wiki/WebSocket).

Although [RxJS](https://rxjs.dev) provides the [WebSocketSubject](https://rxjs.dev/api/webSocket/WebSocketSubject) class, it seems that this class enables only the server to become an Observable and wanted to have it both ways.

### Documentation

The typedoc documentation is available at https://cope.github.io/resynkd/docs/

### Usage

Endpoint1 (Observable)
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
websocket.onmessage(message => {
    let taken = resynkd.message(message, socketSendMethod.bind(socket));    // IMPORTANT: don't forget to bind!
    if(!taken) {
        // do stuff with other messages...
    }
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
websocket.onmessage(message => {
    let taken = resynkd.message(message, socketSendMethod.bind(socket));    // IMPORTANT: don't forget to bind!
    if(!taken) {
        // do stuff with other messages...
    }
});

resynkd.subscribe({
	socketId: 'socket-id',                      // must be same value on both socket endpoints
	subjectId: 'unique_subject_name',          
	send: socketSendMethod.bind(socket),        // IMPORTANT: don't forget to bind!
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

#### WebSocket differences between server and client

If we have a handler method like this:
```javascript
let handler = (message) => {
    // do stuff with message...
}
```

On the server side this method is usually used like this: `connection.socket.on('message', handler);`.

And on the client side, it is usually used like this: `socket.onmessage = (e) => { handler(e.data) };`.

In either case, our handler method must include resynkd processing.
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
let handler = (message) => {
    let taken = resynkd.message(message, socketSendMethod.bind(socket));    // IMPORTANT: don't forget to bind!
    if(!taken) {
        // do stuff with other messages...
    }
}
```

Also, the above passed `socketSendMethod` function is different on the client and server sides.

On the server side the `socketSendMethod` function is usually: `connection.socket.send`.

And on the client side, the `socketSendMethod` function is usually: `e.target.send`.

Putting it all together, this looks like below...

##### Server side
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
fastify.get('/ws', {websocket: true}, (connection, req) => {
    connection.socket.on('message', message => {
        let taken = resynkd.message(message, connection.socket.send.bind(connection.socket));   // IMPORTANT: don't forget to bind!
        if(!taken) {
            // do stuff with other messages...
        }
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
    let taken = resynkd.message(message, e.target.send.bind(e.target));     // IMPORTANT: don't forget to bind!
    if(!taken) {
        // do stuff with other messages...
    }
};
```
