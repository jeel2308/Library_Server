/**--external-- */
const DataLoader = require('dataloader');

/**--relative-- */
const { batchLoadUsersByIds } = require('./auth');
const { batchLoadFolderIdsByUserId } = require('./folder');

const buildDataLoaders = () => {
  return {
    loadUserById: new DataLoader((keys) => batchLoadUsersByIds({ keys })),
    loadFolderIdsByUserId: new DataLoader((keys) =>
      batchLoadFolderIdsByUserId({ keys })
    ),
  };
};

module.exports = buildDataLoaders;
