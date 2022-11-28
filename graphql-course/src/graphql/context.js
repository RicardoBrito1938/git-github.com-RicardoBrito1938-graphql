import fetch from 'node-fetch';
import { getPosts } from './post/util';
import { makeUserDataloader } from './user/dataloaders';
import { getUsers } from './user/util';

export const context = () => {
  return {
    userDataloader: makeUserDataloader(getUsers(fetch)),
    getUsers: getUsers(fetch),
    getPosts: getPosts(fetch),
  };
};
