const LinkMutations = {
  addLink: async (_, args, context) => {
    const {
      input: { url, folderId, isCompleted },
    } = args;
    const {
      dataSources: { links },
    } = context;

    const { _doc } = await links.addLink({ url, folderId, isCompleted });

    return _doc;
  },
  updateLink: async (_, args, context) => {
    const { input: inputArray } = args;
    const {
      dataSources: { links },
    } = context;

    const result = await links.updateLink(inputArray);

    return result;
  },
  deleteLink: async (_, args, context) => {
    const {
      input: { id },
    } = args;
    const {
      dataSources: { links },
    } = context;
    const { _doc } = await links.deleteLink({ linkId: id });

    return _doc;
  },
};

module.exports = LinkMutations;
