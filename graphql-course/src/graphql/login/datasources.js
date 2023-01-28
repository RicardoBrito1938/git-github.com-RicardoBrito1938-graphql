/* eslint-disable space-before-function-paren */
import { RESTDataSource } from 'apollo-datasource-rest';
import { AuthenticationError } from 'apollo-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class LoginApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.API_URL}/users/`;
  }

  async login(userName, password) {
    const user = await this.get('', { userName }, { cacheOptions: { ttl: 0 } });
    const found = !!user.length;

    if (!found) {
      throw new AuthenticationError('User not found');
    }

    const { passwordHash, id: userId } = user[0];
    const isPasswordValid = this.checkUserPassword(password, passwordHash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid password');
    }

    const token = this.createJwtToken({ userId });
    await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });

    return {
      userId,
      token,
    };
  }

  checkUserPassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
  }

  createJwtToken(payload, userId) {
    return jwt.sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: '7d',
    });
  }
}
