const Folder = require('./models');
const _isEmpty = require('lodash/isEmpty');

const addFolder = async ({ name, userId }) => {
  const folder = new Folder({ name, userId });
  await folder.save();
  return folder;
};

const updateFolder = async (filter, update, options) => {
  return await Folder.findOneAndUpdate(filter, update, options);
};

const deleteFolder = async (filter, options) => {
  return await Folder.findOneAndDelete(filter, options);
};

const findSingleFolder = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  const { _doc } = await Folder.findOne(...params);
  return _doc;
};

const findMultipleFolders = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  const res = await Folder.find(...params);
  return res.map(({ _doc }) => _doc);
};

module.exports = {
  addFolder,
  updateFolder,
  deleteFolder,
  findSingleFolder,
  findMultipleFolders,
};
