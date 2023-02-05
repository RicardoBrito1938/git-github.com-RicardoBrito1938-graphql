import Dataloader from 'dataloader';

export const makePostDataloader = (getPosts) => {
  return new Dataloader(async (ids) => {
    const urlQuery = ids.join('&userId=');
    const posts = await getPosts(`?userId=${urlQuery}`);

    return ids.map((id) => {
      return posts.filter((post) => post.userId === id);
    });
  });
};
