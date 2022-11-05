const { User } = require('../models');
const _isEmpty = require('lodash/isEmpty');

const findUser = async (filter, projection) => {
  if (_isEmpty(projection)) {
    return await User.findOne(filter);
  }
  return await User.findOne(filter, projection);
};

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
  return await User.findOneAndUpdate(filter, update, options);
};

module.exports = { findUser, addUser, findOneAndUpdateUser };
