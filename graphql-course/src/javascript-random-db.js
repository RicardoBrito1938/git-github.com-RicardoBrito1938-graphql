const fs = require('fs');
const faker = require('@faker-js/faker');
faker.setLocale('pt_BR');

const generator = () => {
  const users = [];
  const posts = [];
  const comments = [];

  // For reference only
  let indexRef;

  indexRef = 0;
  for (let i = 1; i <= 20; i++) {
    users.push(generateUser(++indexRef));
  }

  const postsRandomness = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  indexRef = 0;
  for (let i = 1; i <= 10; i++) {
    const user = randomFromArray(users);

    for (let j = 1; j <= randomFromArray(postsRandomness); j++) {
      posts.push(generatePost(user.id, ++indexRef));
    }
  }

  const commentRandomness = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  indexRef = 0;
  for (let i = 1; i <= 10; i++) {
    const user = randomFromArray(users);
    const post = randomFromArray(posts);

    for (let j = 1; j <= randomFromArray(commentRandomness); j++) {
      comments.push(generateComment(user.id, post.id, ++indexRef));
    }
  }

  const data = {
    users: faker.helpers.shuffle(users),
    posts: faker.helpers.shuffle(posts),
    comments: faker.helpers.shuffle(comments),
  };

  fs.writeFileSync('./db.json', JSON.stringify(data, null, 4), {
    encoding: 'utf-8',
    flag: 'w+',
  });
};

const generateId = () => `${faker.unique(() => faker.datatype.number(999))}`;

const generateDate = () =>
  faker.date.between(new Date('2015-01-01'), new Date());

const removeAccents = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u1dcf]/g, '');
};

const randomFromArray = (array) => faker.random.arrayElement(array);

const generateComment = (userId, postId, indexRef) => {
  const randomness = [1, 2, 3];
  const id = generateId();
  const comment = faker.lorem.paragraph(randomFromArray(randomness));

  return {
    id,
    comment,
    userId,
    postId,
    indexRef,
    createdAt: generateDate(),
  };
};

const generatePost = (userId, indexRef) => {
  const randomness = [1, 2, 3, 4, 5, 6];
  const id = generateId();
  const title = faker.lorem.lines(1);
  const body = faker.lorem.paragraphs(randomFromArray(randomness));

  return {
    id,
    title,
    body,
    userId,
    indexRef,
    createdAt: generateDate(),
  };
};

const generateUser = (indexRef) => {
  const id = generateId();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const userName = removeAccents(
    faker.internet.userName(firstName, lastName).toLowerCase(),
  );

  return {
    id,
    firstName,
    lastName,
    userName,
    indexRef,
    createdAt: generateDate(),
  };
};

module.exports = generator;
generator();
