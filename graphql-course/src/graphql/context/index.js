import jwt from 'jsonwebtoken';
import { UsersApi } from '../schema/user/datasources';

const cookieParser = (cookiesHeader) => {
  // The final goal is to return an object with key/value reflecting
  // the cookies. So, this functions always returns an object.

  // If we do not receive a string, we won't do anything.
  if (typeof cookiesHeader !== 'string') return {};

  const cookies = cookiesHeader.split(/;\s*/);

  // If we have something similar to cookie, we want to add them
  // to the final object
  const parsedCookie = {};
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');
    parsedCookie[key] = value;
  }

  // The reason I'm using JSON here is to make sure the final
  // object won't have any undefined value.
  return JSON.parse(JSON.stringify(parsedCookie));
};

const verifyJwtToken = async (token) => {
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const userApi = new UsersApi();
    userApi.initialize({});
    const foundUser = await userApi.getUser(userId);

    if (foundUser.token !== token) return '';
    return userId;
  } catch (e) {
    console.log(e);
    return '';
  }
};

const authorizeUserWithBearerToken = async (req) => {
  const { headers } = req;
  const { authorization } = headers;

  if (authorization === undefined) return '';

  try {
    const [_bearer, token] = authorization.split(' ');
    const userId = await verifyJwtToken(token);
    return userId;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const context = async ({ req, res, connection }) => {
  const reqOrConnection = req || connection?.context?.req;
  let loggedUserId = await authorizeUserWithBearerToken(reqOrConnection);

  if (!loggedUserId) {
    if (reqOrConnection?.headers?.cookie) {
      const { jwtToken } = cookieParser(req.headers.cookie);

      loggedUserId = await verifyJwtToken(jwtToken);
    }
  }

  return {
    loggedUserId,
    res,
  };
};
