/**--relative-- */
const { findLinksByIds } = require('../services/link/controllers');
const { mapKeyToResult } = require('./utils');

const batchLoadLinkById = async ({ keys }) => {
  const result = await findLinksByIds({ ids: keys });
  return mapKeyToResult({ keys, keyFunction: (obj) => obj._id, result });
};

module.exports = { batchLoadLinkById };
