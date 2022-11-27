const post = async (_, { id }, { getPosts }) => {
  const response = await getPosts(`/${id}`);
  const post = await response.json();

  return post;
};

const posts = async (_, { input }, { getPosts }) => {
  const apiFilterTypeDefs = new URLSearchParams(input);
  return await getPosts(`/?${apiFilterTypeDefs}`).then((posts) => posts.json());
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
