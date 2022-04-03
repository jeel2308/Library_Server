const UserMutations = {
  updateUser: async (_, args, context) => {
    const {
      dataSources: { users },
    } = context;

    const { input } = args;

    const result = await users.updateUser(input);

    const { _doc: user } = result;

    return user;
  },
};

module.exports = UserMutations;
