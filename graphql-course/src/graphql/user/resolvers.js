const users = async (_, __, { getUsers }) =>
  await getUsers().then((users) => users.json());

const user = async (_, { id }, { getUsers }) => {
  return await getUsers(`/${id}`).then((user) => user.json());
};

export const userResolvers = {
  Query: {
    user,
    users,
  },
};
