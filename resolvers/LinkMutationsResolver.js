const LinkMutations = {
  addLink: async (_, args, context) => {
    try {
      const {
        input: { url, folderId, isCompleted },
      } = args;
      const {
        dataSources: { links },
      } = context;
      const { _doc } = await links.addLink({ url, folderId, isCompleted });

      return { link: _doc, success: true };
    } catch (e) {
      return { success: false, link: null, message: e.message };
    }
  },
  updateLink: async (_, args, context) => {
    try {
      const { input } = args;
      const {
        dataSources: { links },
      } = context;
      const { _doc } = await links.updateLink(input);

      return { link: _doc, success: true };
    } catch (e) {
      return { success: false, link: null, message: e.message };
    }
  },
  deleteLink: async (_, args, context) => {
    try {
      const {
        input: { id },
      } = args;
      const {
        dataSources: { links },
      } = context;
      const { _doc } = await links.deleteLink({ linkId: id });
      return { success: true, link: _doc };
    } catch (e) {
      return { success: false, link: null, message: e.message };
    }
  },
};

module.exports = LinkMutations;
