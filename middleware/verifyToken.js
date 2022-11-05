/**--external-- */
const jwt = require('jsonwebtoken');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const split = require('lodash/split');

/**--relative-- */
const { findUser } = require('../services/auth/queries');

const verifyToken = async (req, res, next) => {
  const { JWT_SECRET } = process.env;

  const authorizationDetails = get(req, 'headers.authorization', '');

  const authorizationArray = split(authorizationDetails, ' ');

  if (!isEmpty(authorizationArray) && authorizationArray[0] === 'Bearer') {
    const token = authorizationArray[1];

    let decodedUser = undefined;
    try {
      decodedUser = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return next({ statusCode: 403, message: e.message || 'Invalid token' });
    }

    let user = undefined;

    try {
      user = await findUser({ _id: decodedUser.id });
    } catch (e) {
      return next({ statusCode: 500, message: e.message });
    }

    if (isEmpty(user)) {
      return next({ statusCode: 404, message: 'User does not exist!' });
    }

    req.user = user;

    return next();
  } else {
    return next({
      statusCode: 401,
      message: 'Authorization headers are missing',
    });
  }
};

module.exports = verifyToken;
