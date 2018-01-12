import React, { Component } from 'react';
import { View, StatusBar, Text } from 'react-native';
import RootScreen from './RootScreen';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from 'subscriptions-transport-ws';
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

const GRAPHQL_ENDPOINT =
  'https://api.graph.cool/simple/v1/cjc5ce2l40dty0181o2u0u07n';
const GRAPHQL_WEBSOCKET_ENDPOINT =
  'wss://subscriptions.graph.cool/v1/cjc5ce2l40dty0181o2u0u07n';

const networkInterface = createNetworkInterface({ uri: GRAPHQL_ENDPOINT });
const wsClient = new SubscriptionClient(GRAPHQL_WEBSOCKET_ENDPOINT, {
  reconnect: true
});
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RootScreen />
      </ApolloProvider>
    );
  }
}

App = codePush(codePushOptions)(App);

export default App;
