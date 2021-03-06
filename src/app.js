import React from 'react';
import ReactDOM from 'react-dom';


import { App } from 'ROOT/logic/App.jsx';

import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { withClientState } from 'apollo-link-state';
import ApolloClient from 'apollo-client';

const WS_HOST = __WS_HOST__;
const WSClient = new SubscriptionClient(`${WS_HOST}api/ws`, {
	reconnect: true,
});

const typeDefs = `
	type Query {
		showBuildMenu: Booleans
		moveMatrix: [String]
		fireballs: [String]
	}
`;

const cache = new InMemoryCache();

const stateLink = withClientState({
		cache,
		defaults: {
			showBuildMenu: false,
			moveMatrix: [],
			fireballs: []
		},
		resolvers: {
		},
		typeDefs
});

const GraphQLClient = new ApolloClient({
	link: ApolloLink.from([stateLink, WSClient]),
	cache,
});

ReactDOM.render(
	<ApolloProvider client={GraphQLClient}>
		<App />
	</ApolloProvider>,
	document.getElementById('app')
);
