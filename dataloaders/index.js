/**--external-- */
const DataLoader = require('dataloader');

/**--relative-- */
const { batchLoadUsersByIds } = require('./auth');
const { batchLoadFolderIdsByUserId, batchLoadFolderById } = require('./folder');
const { batchLoadLinkById } = require('./link');

const buildDataLoaders = () => {
  return {
    loadUserById: new DataLoader((keys) => batchLoadUsersByIds({ keys })),
    loadFolderIdsByUserId: new DataLoader((keys) =>
      batchLoadFolderIdsByUserId({ keys })
    ),
    loadFolderById: new DataLoader((keys) => batchLoadFolderById({ keys })),
    loadLinkById: new DataLoader((keys) => batchLoadLinkById({ keys })),
  };
};

module.exports = buildDataLoaders;
