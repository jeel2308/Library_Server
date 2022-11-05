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
  deleteFolder: async (_, args, context) => {
    const {
      input: { id },
    } = args;
    const {
      dataSources: { links },
    } = context;

    /**
     * Also, mongo does not support cascading deletion,
     * so we have to delete associated entities manually.
     */

    const deleteFolderAndLinksPromise = Promise.all([
      deleteFolderById({ id }),
      links.deleteManyLinks({ folderId: id }),
    ]);
    /**
     * Here we are not returning deleted links because there is no optimal
     * way to delete and return multiple documents in mongodb
     */
    const [folder] = await deleteFolderAndLinksPromise;
    return folder;
  },
};

module.exports = FolderMutations;
