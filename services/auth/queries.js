const { User, RefreshToken } = require('./models');
const _isEmpty = require('lodash/isEmpty');

const addUser = async ({ name, email, password = '' }) => {
  const user = new User({
    name,
    email,
    password,
  });
  await user.save();
  return user;
};

const findOneAndUpdateUser = async (filter, update, options) => {
  return await User.findOneAndUpdate(filter, update, options).lean();
};

const findMultipleUsers = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  return await User.find(...params).lean();
};

const addRefreshToken = async ({ refreshToken, userId }) => {
  const refreshTokenData = new RefreshToken({ refreshToken, userId });
  await refreshTokenData.save();
  return refreshTokenData;
};

/**
 *
 * @param {Object} filter mongosse filter
 */
const deleteRefreshTokens = async (filter) => {
  await RefreshToken.deleteMany(filter);
};

module.exports = {
  findMultipleUsers,
  addUser,
  findOneAndUpdateUser,
  addRefreshToken,
  deleteRefreshTokens,
};
