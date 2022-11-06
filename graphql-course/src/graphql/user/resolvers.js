const user = () => {
  return {
    id: '1',
    userName: 'Ricardo',
  };
};

const users = () => {
  return [
    {
      id: '1',
      userName: 'Ricardo',
    },
    {
      id: '2',
      userName: 'Brito',
    },
  ];
};

export const userResolvers = {
  Query: {
    user,
    users,
  },
};
