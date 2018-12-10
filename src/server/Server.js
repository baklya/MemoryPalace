import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import GraphHTTP from 'express-graphql';

import express from 'express';

import { getMoveMatrix } from './logic/Movement';
import { schema } from './logic/Schema';

import { State } from './logic/Store';

const PORT = 8081;

const app = express();



State._moveMatrix = getMoveMatrix(State.planes);

app.use('/api/ql', GraphHTTP({
	schema: schema,
	graphiql: true,
}));

const server = Server(app);
SubscriptionServer.create({
	schema,
	execute,
	subscribe,
}, {
	server: server,
	path: '/api/ws',
}, );

server.listen(PORT, () => {
	console.log('Server started 🚀');
});
