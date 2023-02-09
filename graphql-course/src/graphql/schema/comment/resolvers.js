/* eslint-disable camelcase */
import { checkIsLoggedIn } from '../login/utils/login-functions';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const CREATED_COMMENT = 'CREATED_COMMENT';

const createComment = async (_, { data }, { dataSources, loggedUserId }) => {
  checkIsLoggedIn(loggedUserId);
  const { postId, comment } = data;

  await dataSources.postApi.getPost(postId);

  return dataSources.commentDb.create({
    postId,
    comment,
    userId: loggedUserId,
  });
};

const user = async ({ user_id }, _, { dataSources }) => {
  const user = await dataSources.userApi.batchLoadById(user_id);
  return user;
};

const createdComment = {
  subscribe: () => {
    return pubsub.asyncIterator(CREATED_COMMENT);
  },
};

export const commentResolvers = {
  Mutation: { createComment },
  Subscription: {
    createdComment,
  },
  Comment: { user },
};
