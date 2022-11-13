const { findMultipleUsersById } = require('../services/auth/controllers');

const batchLoadUsersByIds = async ({ keys }) => {
  return await findMultipleUsersById({ ids: keys });
};

module.exports = { batchLoadUsersByIds };
