const { updateUserById } = require('../services/auth/controllers');

const UserMutations = {
  updateUser: async (_, args) => {
    const { input } = args;
    return await updateUserById(input);
  },
};

module.exports = UserMutations;
