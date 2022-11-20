/**--relative-- */
const { findMultipleUsersById } = require('../services/auth/controllers');
const { mapKeyToResult } = require('./utils');

const batchLoadUsersByIds = async ({ keys }) => {
  const result = await findMultipleUsersById({ ids: keys });
  return mapKeyToResult({ keys, keyFunction: (user) => user._id, result });
};

module.exports = { batchLoadUsersByIds };
