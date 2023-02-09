import { gql } from 'apollo-server';
import { postResolvers } from './post/resolvers';
import { postTypeDefs } from './post/typedefs';
import { userResolvers } from './user/resolvers';
import { userTypeDefs } from './user/typedefs';
import { apiFiltersResolvers } from './api-filters/resolvers';
import { loginTypeDefs } from './login/typedefs';
import { loginResolvers } from './login/resolvers';
import { apiFilterTypeDefs } from './api-filters/typedefs';
import { commentTypeDefs } from './comment/typedefs';
import { commentResolvers } from './comment/resolvers';

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
  type Subscription {
    _empty: Boolean
  }
`;

const rootResolvers = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
  Subscription: {
    _empty: () => true,
  },
};

export const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  postTypeDefs,
  apiFilterTypeDefs,
  loginTypeDefs,
  commentTypeDefs,
];
export const resolvers = [
  rootResolvers,
  userResolvers,
  postResolvers,
  apiFiltersResolvers,
  loginResolvers,
  commentResolvers,
];
