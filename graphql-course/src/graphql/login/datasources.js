/* eslint-disable space-before-function-paren */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RESTDataSource } from 'apollo-datasource-rest';
import { AuthenticationError } from 'apollo-server-errors';

export class LoginApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.API_URL}/users/`;
  }

  async getUser(userName) {
    const user = await this.get('', { userName }, { cacheOptions: { ttl: 0 } });

    const found = !!user.length;

    if (!found) {
      throw new AuthenticationError('User does not exist.');
    }

    return user[0];
  }

  async login(userName, password) {
    const user = await this.getUser(userName);

    const { passwordHash, id: userId } = user;
    const isPasswordValid = await this.checkUserPassword(
      password,
      passwordHash,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid password.');
    }

    const token = this.createJwtToken({ userId });
    await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });

    return {
      userId,
      token,
    };
  }

  async logout(userName) {
    const user = await this.getUser(userName);

    if (user.id !== this.context.loggedUserId) {
      throw new AuthenticationError('You can not logout this user');
    }

    await this.patch(user.id, { token: '' }, { cacheOptions: { ttl: 0 } });

    return true;
  }

  checkUserPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  createJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }
}
