/**--external-- */
const _map = require('lodash/map');
const _reduce = require('lodash/reduce');

/**--relative-- */
const {
  aggregateFolderIdsByUserIds,
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

module.exports = { batchLoadFolderIdsByUserId };
