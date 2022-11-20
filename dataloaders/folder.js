/**--relative-- */
const {
  aggregateFolderIdsByUserIds,
  findMultipleFoldersById,
} = require('../services/folder/controllers');
const { mapKeyToResult } = require('./utils');

const batchLoadFolderIdsByUserId = async ({ keys }) => {
  const result = await aggregateFolderIdsByUserIds({ userIds: keys });
  return mapKeyToResult({
    keys,
    keyFunction: (obj) => obj._id,
    result,
    mappingFunction: (obj) => obj.folders,
  });
};

const batchLoadFolderById = async ({ keys }) => {
  const result = await findMultipleFoldersById({ ids: keys });
  return mapKeyToResult({ keys, keyFunction: (obj) => obj._id, result });
};

module.exports = { batchLoadFolderIdsByUserId, batchLoadFolderById };
