#!/usr/bin/env node
'use strict';

export default (socketId: string, observableId: string, payload: any) =>
	JSON.stringify({
		rsynkd: {
			socketId,
			observableId,
			payload
		}
	});
