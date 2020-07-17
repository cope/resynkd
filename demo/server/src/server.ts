#!/usr/bin/env node
'use strict';

import { AddressInfo } from 'net';
import * as dotenv from 'dotenv';

import * as Fastify from 'fastify';
import * as fastifyWebsocket from 'fastify-websocket';

import websocket from './websocket';

const fastify = Fastify({ logger: true });
fastify.register(fastifyWebsocket);

dotenv.config();

const addWebSocketListener = (server) => server.get('/ws', { websocket: true }, websocket);

// Start the server
const startFastifyServer = async () => {
	try {
		addWebSocketListener(fastify);

		await fastify.listen(process.env.PORT);
		fastify.log.info(`server listening on ${(fastify.server.address() as AddressInfo).port}`);

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

process.on('uncaughtException', error => console.error('uncaughtException', error));
process.on('unhandledRejection', error => console.error('unhandledRejection', error));

startFastifyServer()
	.then(() => ({}))
	.catch((err) => console.error);