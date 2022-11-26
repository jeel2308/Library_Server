const jwt = require('jsonwebtoken');

const encodeToBase64 = ({ text }) => {
  return Buffer.from(text).toString('base64');
};

const decodeFromBase64 = ({ text }) => {
  return Buffer.from(text, 'base64').toString('ascii');
};

/**
 * @deprecated
 */
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

/**
 *
 * @param {Object} param0
 * @param {String} param0.time time string like 7d, 1w, 5h
 * @returns
 */
const convertTimeStringInSeconds = ({ time }) => {
  const numericMultiplier = parseInt(time);
  const timeSuffix = time[time.length - 1];

  let seconds;
  switch (timeSuffix) {
    case 'd': {
      seconds = 86400;
      break;
    }
    case 'w': {
      seconds = 7 * 86400;
      break;
    }
    case 'h': {
      seconds = 3600;
      break;
    }
  }

  return numericMultiplier * seconds;
};

module.exports = {
  encodeToBase64,
  decodeFromBase64,
  generateJwt,
  generatePassword,
  convertTimeStringInSeconds,
};
