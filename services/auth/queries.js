const { User } = require('./models');
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

module.exports = {
  findMultipleUsers,
  addUser,
  findOneAndUpdateUser,
};
