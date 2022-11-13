const posts = async (_, __, { getPosts }) =>
  await getPosts().then((posts) => posts.json());

const post = async (_, { id }, { getPosts }) => {
  return await getPosts(`/${id}`).then((post) => post.json());
};

export const postResolvers = {
  Query: {
    post,
    posts,
  },
};
