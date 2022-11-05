const jwt = require('jsonwebtoken');

const encodeToBase64 = ({ text }) => {
  return Buffer.from(text).toString('base64');
};

const decodeFromBase64 = ({ text }) => {
  return Buffer.from(text, 'base64').toString('ascii');
};

const generateJwt = ({ user }) => {
  const { JWT_SECRET, ACCESS_TOKEN_EXPIRATION_DURATION } = process.env;
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_DURATION,
  });
};

const generatePassword = ({ length }) => {
  return Math.random()
    .toString(20)
    .substring(2, 2 + length);
};

module.exports = {
  encodeToBase64,
  decodeFromBase64,
  generateJwt,
  generatePassword,
};
