const {
  addFolderByUserId,
  updateFolderById,
  deleteFolderById,
} = require('../services/folder/controllers');

/**
 * If any error is thrown inside any resolver it will be treated as ApolloError.
 * So, all errors that occur during execution of operation will be available
 * in errors Array at client side.
 */
const FolderMutations = {
  addFolder: async (_, args, context) => {
    const { input } = args;

    const { user } = context;
    const userId = user._id;

    return await addFolderByUserId({ userId, ...input });
  },
  updateFolder: async (_, args) => {
    const { input } = args;
    return await updateFolderById(input);
  },
  deleteFolder: async (_, args) => {
    const {
      input: { id },
    } = args;

    const { folder, links } = await deleteFolderById({ id });
    /**
     * Think better solution for how to avoid computation of linksV2
     */
    return { ...folder, linksV2: links };
  },
};

module.exports = FolderMutations;
