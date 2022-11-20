/**--relative-- */
const { findMultipleFoldersById } = require('../services/folder/controllers');
const { mapKeyToResult } = require('./utils');

const batchLoadFolderById = async ({ keys }) => {
  const result = await findMultipleFoldersById({ ids: keys });
  return mapKeyToResult({ keys, keyFunction: (obj) => obj._id, result });
};

module.exports = { batchLoadFolderById };
