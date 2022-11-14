const post = async (_, { id }, { getPosts }) => {
  return await getPosts(`/${id}`).then((post) => post.json());
};

const posts = async (_, { input }, { getPosts }) => {
  const apiFilterTypeDefs = new URLSearchParams(input);
  return await getPosts(`/?${apiFilterTypeDefs}`).then((posts) => posts.json());
};

export const postResolvers = {
  Query: {
    post,
    posts,
  },
};
