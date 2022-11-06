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
  const { _doc } = await User.findOneAndUpdate(filter, update, options);
  return _doc;
};

const findMultipleUsers = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  const res = await User.find(...params);
  return res.map(({ _doc }) => _doc);
};

module.exports = {
  findMultipleUsers,
  addUser,
  findOneAndUpdateUser,
};
