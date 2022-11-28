const post = async (_, { id }, { dataSources }) => {
  const post = dataSources.postApi.getPost(id);
  return post;
};

const posts = async (_, { input }, { dataSources }) => {
  const posts = dataSources.postApi.getPosts(input);
  return posts;
};

const user = async ({ userId }, __, { userDataloader }) => {
  return userDataloader.load(userId);
};

export const postResolvers = {
  Query: {
    post,
    posts,
  },
  Post: {
    user,
  },
};
