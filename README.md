# resynkd
Client-Server WebSocket Observable pattern implementation.

## Usage

Endpoint1 (Observable)
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
websocket.onmessage(message => {
    let taken = resynkd.message(message, socketSendMethod);
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
    let taken = resynkd.message(message, socketSendMethod);
    if(!taken) {
        // do stuff with other messages...
    }
});

resynkd.subscribe({
	socketId: 'socket-id',                      // must be same value on both socket endpoints
	subjectId: 'unique_subject_name',          
	send: socketSendMethod,
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

### WebSocket differences between server and client

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
    let taken = resynkd.message(message, socketSendMethod);
    if(!taken) {
        // do stuff with other messages...
    }
}
```

Also, the above passed `socketSendMethod` function is different on the client and server sides.

On the server side the `socketSendMethod` function is usually: `connection.socket.send`.

And on the client side, the `socketSendMethod` function is usually: `e.target.send`.

Putting it all together, this looks like below...

#### Server side
```javascript
import ReSynkd from "resynkd";
const resynkd = new ReSynkd();
fastify.get('/ws', {websocket: true}, (connection, req) => {
    connection.socket.on('message', message => {
        let taken = resynkd.message(message, connection.socket.send);
        if(!taken) {
            // do stuff with other messages...
        }
    });
});
```

#### Client side
```javascript
const ReSynkd = require('resynkd');
const resynkd = new ReSynkd();

let socket = new WebSocket(YOUR_WS_URI);
socket.onmessage = (e) => {
    let { data: message } = e;
    let taken = resynkd.message(message, connection.socket.send);
    if(!taken) {
        // do stuff with other messages...
    }
};
```
