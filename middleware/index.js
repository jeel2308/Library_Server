/**--external-- */
const jwt = require('jsonwebtoken');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const split = require('lodash/split');

/**--internal-- */
const { User } = require('../models');
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
      res.status(401).send({ success: false, message: 'Invalid token' });
      return;
    }

    let user = undefined;

    try {
      user = await User.findOne({ _id: decodedUser.id });
    } catch (e) {
      res.status(500).send({ success: false, message: 'Server error' });
      return;
    }

    if (isEmpty(user)) {
      res.status(401).send({ success: false, message: 'User not found' });
      return;
    }

    req.user = user;
    next();
    return;
  } else {
    res.status(401).send({ success: false, message: 'User not found' });
    return;
  }
};

module.exports = { verifyToken };
