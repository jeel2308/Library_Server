const { User } = require('./models');
const _isEmpty = require('lodash/isEmpty');

const findSingleUser = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  const { _doc } = await User.findOne(...params);
  return _doc;
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

const findMultipleUsers = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  const res = await User.find(...params);
  return res.map(({ _doc }) => _doc);
};

module.exports = {
  findSingleUser,
  findMultipleUsers,
  addUser,
  findOneAndUpdateUser,
};
