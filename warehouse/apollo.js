import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";

const makeApolloClient = (token) => {
    const link = new HttpLink({
        uri: `http://192.168.43.171:4000/ZCI6MSwiaWF0IjoxNjA5MjUzNjIxLCJleHAiOjE2MDkyNjA4MjF9.Z7_l9OYonfdc3XlYfwiXWYO98x6QTis-Z6YlknlejT0`,
        headers: {
            authentication: `Bearer ${token}`
        }
    });
    // create an inmemory cache instance for caching graphql data
    const cache = new InMemoryCache()
    // instantiate apollo client with apollo link instance and cache instance
    const client = new ApolloClient({
        link,
        cache
    });
    return client;
}
export default makeApolloClient;

