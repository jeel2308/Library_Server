const {
  addSingleLinkByFolderId,
  updateLinksById,
  deleteLinksById,
} = require('../services/link/controllers');

const LinkMutations = {
  addLink: async (_, args) => {
    const { input } = args;
    return await addSingleLinkByFolderId(input);
  },
  updateLink: async (_, args) => {
    const { input } = args;
    return await updateLinksById(input);
  },
  deleteLink: async (_, args) => {
    const { input } = args;
    return await deleteLinksById(input);
  },
  updateLinksMetadata: async (_, args) => {
    const { input } = args;
    return await updateLinksById(input);
  },
};

module.exports = LinkMutations;
