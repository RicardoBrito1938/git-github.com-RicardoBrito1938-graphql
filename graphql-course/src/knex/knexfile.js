const { resolve } = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: resolve(__dirname, '..', '..', '.env'),
});

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      user: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname, 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'seeds'),
    },
  },
  production: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      user: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname, 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'seeds'),
    },
  },
};
