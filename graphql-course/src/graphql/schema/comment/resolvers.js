/* eslint-disable camelcase */
import { checkIsLoggedIn } from '../login/utils/login-functions';
import { PubSub, withFilter } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const CREATED_COMMENT = 'CREATED_COMMENT';

const createComment = async (_, { data }, { dataSources, loggedUserId }) => {
  checkIsLoggedIn(loggedUserId);
  const { postId, comment } = data;

  const post = await dataSources.postApi.getPost(postId);

  return dataSources.commentDb.create({
    postId,
    comment,
    userId: loggedUserId,
    postOwner: post?.userId || null,
  });
};

const user = async ({ user_id }, _, { dataSources }) => {
  const user = await dataSources.userApi.batchLoadById(user_id);
  return user;
};

const createdComment = {
  subscribe: withFilter(
    () => {
      return pubsub.asyncIterator(CREATED_COMMENT);
    },
    (payload, _variables, context) => {
      const hasPostOwner = payload?.postOwner !== null;
      const postOwnerIsLoggedUser =
        payload?.postOwner === context?.loggedUserId;
      const shouldNotify = hasPostOwner && postOwnerIsLoggedUser;
      return shouldNotify;
    },
  ),
};

export const commentResolvers = {
  Mutation: { createComment },
  Subscription: {
    createdComment,
  },
  Comment: { user },
};
