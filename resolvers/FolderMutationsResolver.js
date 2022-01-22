/**
 * If any error is thrown inside any resolver it will be treated as ApolloError.
 * So, all errors that occur during execution of operation will be available
 * in errors Array at client side.
 */
const FolderMutations = {
  addFolder: async (_, args, context) => {
    const {
      input: { name },
    } = args;

    const {
      dataSources: { folders },
      user,
    } = context;

    const userId = user._id;
    const { _doc } = await folders.addFolder({ name, userId });

    return _doc;
  },
  updateFolder: async (_, args, context) => {
    const { input } = args;
    const {
      dataSources: { folders },
    } = context;
    const { _doc } = await folders.updateFolder(input);

    return _doc;
  },
  deleteFolder: async (_, args, context) => {
    const {
      input: { id },
    } = args;
    const {
      dataSources: { links, folders },
    } = context;
    const deleteFolderAndLinksPromise = Promise.all([
      folders.deleteFolder({ folderId: id }),
      links.deleteManyLinks({ folderId: id }),
    ]);
    /**
     * Here we are not returning deleted links because there is no optimal
     * way to delete and return multiple documents in mongodb
     */
    const [folderQuery] = await deleteFolderAndLinksPromise;
    const { _doc } = folderQuery;

    return _doc;
  },
};

module.exports = FolderMutations;
