const Folder = require('./models');
const _isEmpty = require('lodash/isEmpty');

const addFolder = async ({ name, userId }) => {
  const folder = new Folder({ name, userId });
  await folder.save();
  return folder;
};

const updateFolder = async (filter, update, options) => {
  return await Folder.findOneAndUpdate(filter, update, options).lean();
};

const deleteFolder = async (filter, options) => {
  return await Folder.findOneAndDelete(filter, options).lean();
};

const findMultipleFolders = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  return await Folder.find(...params).lean();
};

const aggregateFolders = async (pipeline) => {
  return await Folder.aggregate(pipeline);
};

module.exports = {
  addFolder,
  updateFolder,
  deleteFolder,
  findMultipleFolders,
  aggregateFolders,
};
