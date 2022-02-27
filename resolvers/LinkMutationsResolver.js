const _map = require('lodash/map');

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

    return _map(result, ({ _doc }) => _doc);
  },
  deleteLink: async (_, args, context) => {
    const { input: inputArray } = args;
    const {
      dataSources: { links },
    } = context;
    const result = await links.deleteLink(inputArray);

    return _map(result, ({ _doc }) => {
      return _doc;
    });
  },
};

module.exports = LinkMutations;
