#!/usr/bin/env node
'use strict';

import * as uuidv4 from 'uuid/v4';

type wsMessageType = 'next' | 'subscribe' | 'unsubscribe' | 'subscribeResponse';

export default (
	type: wsMessageType,
	socketId: string,
	observableId: string,
	payload: any,
	messageId = uuidv4()
): any =>
	JSON.stringify(
		{
			rsynkd: {
				type,
				socketId,
				observableId,
				payload,
				messageId
			}
		}
	);
