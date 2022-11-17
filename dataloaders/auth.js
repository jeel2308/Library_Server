/**--external-- */
const _reduce = require('lodash/reduce');
const _map = require('lodash/map');

/**--relative-- */
const { findMultipleUsersById } = require('../services/auth/controllers');

const batchLoadUsersByIds = async ({ keys }) => {
  const result = await findMultipleUsersById({ ids: keys });
  const usersById = _reduce(
    result,
    (acc, user) => {
      return { ...acc, [user._id]: user };
    },
    {}
  );
  return _map(keys, (userId) => usersById[userId]);
};

module.exports = { batchLoadUsersByIds };
