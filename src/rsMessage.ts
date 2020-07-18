'use strict';

import { v4 as uuidv4 } from 'uuid';
import { RsMessageType, RsMethod } from './resynkd.types';

export { RsMessageType };

export default (
	method: RsMethod,
	socketId: string,
	subjectId: string,
	payload: any = '',
	messageId = uuidv4(),
): string =>
	JSON.stringify(
		{
			rsynkd: {
				method,
				socketId,
				subjectId,
				payload,
				messageId,
			},
		},
	);
