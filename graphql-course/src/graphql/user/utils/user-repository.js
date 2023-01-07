import { ValidationError } from 'apollo-server';

const validateUserName = (userName) => {
  const userNameRegExp = /^[a-z]([a-z0-9_.-]+)+$/gi;

  if (!userName.match(userNameRegExp)) {
    throw new ValidationError(`userName must match ${userNameRegExp}`);
  }
};

const checkUserFields = (user, allFieldsRequired = true) => {
  const userFields = ['firstName', 'lastName', 'userName'];

  for (const field in userFields) {
    if (!allFieldsRequired) {
      if (typeof user[field] === 'undefined') {
        continue;
      }
    }

    if (field === 'userName') {
      validateUserName(user[field]);
    }

    if (!user[field]) {
      throw new ValidationError(`Missing ${field}`);
    }
  }
};

export const createUserFn = async (userData, dataSource) => {
  checkUserFields(userData, true);

  const indexRefUser = await dataSource.get('', {
    _limit: 1,
    _sort: 'indexRef',
    _order: 'desc',
  });

  const indexRef = indexRefUser[0].indexRef + 1;

  const foundUser = await userExists(userData.userName, dataSource);

  if (typeof foundUser !== 'undefined') {
    throw new ValidationError(
      `userName ${userData.userName} has already been taken`,
    );
  }

  return dataSource.post('', {
    ...userData,
    indexRef,
    createdAt: new Date().toISOString(),
  });
};

export const deleteUserFn = async (userId, dataSource) => {
  if (!userId) throw new ValidationError('Missing userId');

  const deleted = await dataSource.delete(userId);

  return !!deleted;
};

export const updateUserFn = async (userId, userData, dataSource) => {
  checkUserFields(userData, false);

  if (!userId) throw new ValidationError('Missing use Id');

  if (userData.userName) {
    const foundUser = await userExists(userData.userName, dataSource);

    if (typeof foundUser !== 'undefined' && foundUser.id !== userId) {
      throw new ValidationError(
        `userName ${userData.userName} has already been taken`,
      );
    }

    return dataSource.patch(userId, { ...userData });
  }
};

const userExists = async (username, dataSource) => {
  const found = await dataSource.get('', {
    username,
  });
  return found[0];
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
