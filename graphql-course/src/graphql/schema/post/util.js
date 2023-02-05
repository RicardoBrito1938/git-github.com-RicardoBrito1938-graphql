/* eslint-disable indent */
export const getPosts =
  (fetch) =>
  (path = '/') => {
    return fetch(`${process.env.API_URL}/posts${path}`);
  };
