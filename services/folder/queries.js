const Folder = require('./models');
const _isEmpty = require('lodash/isEmpty');

const addFolder = async ({ name, userId }) => {
  const folder = new Folder({ name, userId });
  await folder.save();
  return folder;
};

const updateFolder = async (filter, update, options) => {
  const { _doc } = await Folder.findOneAndUpdate(filter, update, options);
  return _doc;
};

const deleteFolder = async (filter, options) => {
  const { _doc } = await Folder.findOneAndDelete(filter, options);
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
  findMultipleFolders,
};
