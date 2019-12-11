'use strict';
require('make-promises-safe');

// TODO: create a subject per model
// Then create an onserver per WS connection - on clients "subscribe" request
const Rx = require('rxjs');
const subject = new Rx.BehaviorSubject(0);
let observer = subject.subscribe({
	next: (v) => console.log('observerA: ' + v)
});
subject.next(1);
observer.unsubscribe();

// Require the framework and instantiate it
const fastify = require('fastify')({logger: true});
const fastifyBlipp = require("fastify-blipp");
const fastifyHelmet = require('fastify-helmet');
const fastifyWebsocket = require('fastify-websocket');

fastify.register(fastifyBlipp);
fastify.register(fastifyHelmet, {noCache: true});

// WebSockets
fastify.register(fastifyWebsocket);
fastify.get('/ws', {websocket: true}, (connection, req) => {
	connection.socket.on('message', message => {
		console.log('Message from client:', message);
		connection.socket.send(JSON.stringify({msg: 'hi from server'}));
	})
});

// Declare a route
fastify.get('/', async (request, reply) => {
	reply
		.header('Content-Type', 'application/json')
		.header('puppy', '...is having fun.')
		.code(200)
		.send({hello: 'world'});
});

const start = async () => {
	try {
		await fastify.listen(1337);
		fastify.blipp();
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

// Run the server!
start()
	.then(() => ({}))
	.catch(console.error);
