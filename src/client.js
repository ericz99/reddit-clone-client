import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_API,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-auth-token': accessToken ? accessToken : '',
      'x-refresh-token': refreshToken ? refreshToken : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
