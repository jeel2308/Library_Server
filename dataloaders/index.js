/**--external-- */
const DataLoader = require('dataloader');

/**--relative-- */
const { batchLoadUsersByIds } = require('./auth');

const buildDataLoaders = () => {
  return {
    loadUserById: new DataLoader((keys) => batchLoadUsersByIds({ keys })),
  };
};

module.exports = buildDataLoaders;
