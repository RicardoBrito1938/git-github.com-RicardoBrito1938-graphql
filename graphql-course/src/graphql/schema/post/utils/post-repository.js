import { ValidationError, FetchError } from 'apollo-server';

export const findPostOwner = async (dataSource, postId) => {
  const foundPost = await dataSource.get(postId, undefined, {
    cacheOptions: {
      ttl: 0,
    },
  });

  if (!foundPost) throw new FetchError('Post not found');

  if (foundPost.userId !== dataSource.context.loggedUserId) {
    throw new ValidationError('You can not change the userId of a post');
  }

  return foundPost;
};

export const createPostFn = async (postData, dataSource) => {
  const postInfo = await createPostInfo(postData, dataSource);
  const { title, body, userId } = postInfo;
  if (!title || !body || !userId) {
    throw new ValidationError('You have to send title, body and userId');
  }

  return await dataSource.post('', { ...postInfo });
};

export const deletePostFn = async (postId, dataSource) => {
  if (!postId) throw new ValidationError('Missing postId');
  await findPostOwner(dataSource, postId);

  const deleted = await dataSource.delete(postId);

  return !!deleted;
};

export const updatePostFn = async (postId, postData, dataSource) => {
  if (!postId) {
    throw new ValidationError('Missing postId');
  }

  const foundPost = await findPostOwner(dataSource, postId);

  const { userId } = foundPost;
  const { title, body } = postData;

  if (typeof title !== 'undefined') {
    if (!title) {
      throw new ValidationError('Title missing');
    }
  }

  if (typeof body !== 'undefined') {
    if (!body) {
      throw new ValidationError('Body missing');
    }
  }

  if (typeof userId !== 'undefined') {
    if (!userId) {
      throw new ValidationError('userId missing');
    }
    await userExists(userId, dataSource);
  }

  return await dataSource.patch(postId, { ...postData });
};

const userExists = async (userId, dataSource) => {
  try {
    await dataSource.context.dataSources.userApi.get(userId);
  } catch (error) {
    throw new ValidationError(`User ${userId}  does not exist`);
  }
};

export const createPostInfo = async (postData, dataSource) => {
  const { title, body, userId } = postData;

  await userExists(userId, dataSource);

  const indexRefPost = await dataSource.get('', {
    _limit: 1,
    _sort: 'indexRef',
    _order: 'desc',
  });

  const indexRef = indexRefPost[0].indexRef + 1;

  return {
    title,
    body,
    userId,
    indexRef,
    createdAt: new Date().toISOString(),
  };
};
