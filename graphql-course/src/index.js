import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefs } from './graphql/schema';
import { context } from './graphql/context';
import { PostApi } from './graphql/post/datasources';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postApi: new PostApi(),
    };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
