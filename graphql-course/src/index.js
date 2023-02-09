import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefs } from './graphql/schema';
import { context } from './graphql/context';
import { PostApi } from './graphql/schema/post/datasources';
import { UsersApi } from './graphql/schema/user/datasources';
import { LoginApi } from './graphql/schema/login/datasources';
import { CommentSQLDataSource } from './graphql/schema/comment/datasources';
import { knex } from './knex';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postApi: new PostApi(),
      userApi: new UsersApi(),
      loginApi: new LoginApi(),
      commentDb: new CommentSQLDataSource(knex),
    };
  },
  uploads: false,
  cors: {
    origin: '*',
    credentials: false,
  },
  subscriptions: {
    path: '/',
    onConnect: (connectionParams, webSocket, _context) => {
      return {
        req: webSocket.upgradeReq,
      };
    },
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
