export const login = async (_, { data }, { dataSources }) => {
  const { userName, password } = data;
  const user = await dataSources.loginApi.login(userName, password);
  return user;
};

export const logout = async (_, { userName }, { dataSources }) => {
  return dataSources.loginApi.logout(userName);
};

export const loginResolvers = {
  Mutation: {
    login,
    logout,
  },
};
