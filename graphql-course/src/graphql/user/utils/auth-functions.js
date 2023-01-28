import { AuthenticationError } from 'apollo-server-errors';

export const checkIsLoggedIn = (loggedUserId) => {
  if (!loggedUserId) {
    throw new AuthenticationError('You must be logged in to update a user');
  }
};

export const checkOwner = (loggedUserId, userId) => {
  checkIsLoggedIn(loggedUserId);
  if (loggedUserId !== userId) {
    throw new AuthenticationError('You can not update this user');
  }
};
