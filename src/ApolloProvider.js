import React from 'react';
import App from './App';
import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, split} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import {createStore,combineReducers} from 'redux';
import {Provider} from 'react-redux';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

 
const httpLink = createHttpLink({
    uri: 'https://sheltered-citadel-15083.herokuapp.com',
  });


const wsLink = new WebSocketLink({uri:"wss://sheltered-citadel-15083.herokuapp.com/graphql",options:{
    connectionParams: {
        token: localStorage.getItem('iam') ? JSON.parse(localStorage.getItem('iam')).token : undefined
      },
      reconnect:true
}});

const subscriptionMiddleware={
    applyMiddleware: async (options, next) => {
      options.token = localStorage.getItem('iam') ? JSON.parse(localStorage.getItem('iam')).token : undefined;
      next();
    }
}

wsLink.subscriptionClient.use([subscriptionMiddleware]);
  
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('iam') ? JSON.parse(localStorage.getItem('iam')).token : undefined;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );



const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});



//const store = createStore(combineReducers(),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)
