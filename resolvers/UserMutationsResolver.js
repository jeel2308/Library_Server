const { findOneAndUpdateUser } = require('../services/auth/queries');

const UserMutations = {
  updateUser: async (_, args) => {
    const { input } = args;
    const { id, ...otherUpdates } = input;

    const result = await findOneAndUpdateUser({ _id: id }, otherUpdates, {
      new: true,
    });

    return result;
  },
};

module.exports = UserMutations;
