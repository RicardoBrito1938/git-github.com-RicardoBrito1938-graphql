import Dataloader from 'dataloader';

export const makeUserDataloader = (getUsers) => {
  return new Dataloader(async (ids) => {
    const urlQuery = ids.join('&id=');
    const response = await getUsers(`?id=${urlQuery}`);
    const users = await response.json();

    return ids.map((id) => users.find((user) => user.id === id));
  });
};
