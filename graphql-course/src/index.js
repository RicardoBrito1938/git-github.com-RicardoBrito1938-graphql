import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefs } from './graphql/schema';
import { context } from './graphql/context';
import { PostApi } from './graphql/post/datasources';
import { UsersApi } from './graphql/user/datasources';
import { LoginApi } from './graphql/login/datasources';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postApi: new PostApi(),
      userApi: new UsersApi(),
      loginApi: new LoginApi(),
    };
  },
  uploads: false,
  cors: {
    origin: ['https://cdpn.io'],
    credentials: false,
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
