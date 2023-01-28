// Query resolvers
const users = async (_, { input }, { dataSources }) => {
  const users = await dataSources.userApi.getUsers(input);
  return users;
};

const user = async (_, { id }, { dataSources }) => {
  const user = await dataSources.userApi.getUser(id);
  return user;
};

// Mutation Resolvers
const createUser = async (_, { data }, { dataSources }) => {
  return dataSources.userApi.createUser(data);
};

const updateUser = async (
  _,
  { userId, data },
  { dataSources, loggedUserId },
) => {
  if (!loggedUserId) throw new Error('You must be logged in to update a user');
  if (loggedUserId !== userId) throw new Error('You can not update this user');

  return dataSources.userApi.updateUser(userId, data);
};

const deleteUser = async (_, { userId }, { dataSources }) => {
  return dataSources.userApi.deleteUser(userId);
};

// Field Resolvers
const posts = ({ id }, _, { dataSources }) => {
  return dataSources.postApi.batchLoadByUserId(id);
};

export const userResolvers = {
  Query: { user, users },
  Mutation: { createUser, updateUser, deleteUser },
  User: { posts },
};
