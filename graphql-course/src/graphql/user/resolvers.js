const user = async (_, { id }, { getUsers }) => {
  return await getUsers(`/${id}`).then((user) => user.json());
};

const users = async (_, { input }, { getUsers }) => {
  const apiFilterTypeDefs = new URLSearchParams(input);

  return await getUsers(`/?${apiFilterTypeDefs}`).then((users) => users.json());
};

const posts = ({ id }, _, { postDataloader }) => {
  return postDataloader.load(id);
};

export const userResolvers = {
  Query: {
    user,
    users,
  },
  User: {
    posts,
  },
};
