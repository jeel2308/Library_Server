/**--external-- */
const _map = require('lodash/map');
const _reduce = require('lodash/reduce');

/**--relative-- */
const {
  aggregateFolderIdsByUserIds,
  findMultipleFoldersById,
} = require('../services/folder/controllers');

const batchLoadFolderIdsByUserId = async ({ keys }) => {
  const result = await aggregateFolderIdsByUserIds({ userIds: keys });

  const foldersAndUserMapping = _reduce(
    result,
    (acc, { _id, folders }) => {
      return {
        ...acc,
        [_id]: folders,
      };
    },
    {}
  );

  return _map(keys, (key) => foldersAndUserMapping[key]);
};

const batchLoadFolderById = async ({ keys }) => {
  const result = await findMultipleFoldersById({ ids: keys });

  const folderIdAndFolderMapping = _reduce(
    result,
    (acc, folder) => {
      return {
        ...acc,
        [folder._id]: folder,
      };
    },
    {}
  );

  return _map(keys, (key) => folderIdAndFolderMapping[key]);
};

module.exports = { batchLoadFolderIdsByUserId, batchLoadFolderById };
