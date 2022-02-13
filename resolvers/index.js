/**--external--*/
const _map = require('lodash/map');

/**--relative--*/
const FolderMutations = require('./FolderMutationsResolver');
const LinkMutations = require('./LinkMutationsResolver');

const resolvers = {
  Query: {
    node: async (root, args, context, info) => {
      const { input } = args;
      const {
        dataSources: { folders, links, users },
      } = context;

      const { id, type } = input;

      let data = {};

      switch (type) {
        case 'USER': {
          data = await users.findOneById(id);
          break;
        }

        case 'FOLDER': {
          data = await folders.findOneById(id);
          break;
        }

        case 'LINK': {
          data = await links.findOneById(id);
        }
      }
      const { _doc } = data;
      return { ..._doc, type };
    },
    multiNode: async (root, args, context) => {
      const {
        input: { ids, type },
      } = args;

      const {
        dataSources: { folders, links, users },
      } = context;

      let data = [];

      switch (type) {
        case 'FOLDER': {
          data = await folders.findManyByIds(ids);
          break;
        }

        case 'LINK': {
          data = await links.findManyByIds(ids);
          break;
        }

        case 'USER': {
          data = await users.findManyByIds(ids);
        }
      }

      return _map(data, (item) => {
        const { _doc } = item;
        return { ..._doc, type };
      });
    },
  },
  Node: {
    __resolveType: (obj, ctx, info) => {
      const { type } = obj;

      switch (type) {
        case 'USER': {
          return 'User';
        }

        case 'FOLDER': {
          return 'Folder';
        }

        case 'LINK': {
          return 'Link';
        }

        default: {
          return null;
        }
      }
    },
  },
  Mutation: {
    folderManagement: () => ({}),
    linkManagement: () => ({}),
  },
  User: {
    id: ({ _id }) => _id,
    folders: async (parent, args, context) => {
      const {
        dataSources: { folders },
      } = context;

      const id = parent._id;

      const res = await folders.findByFields({ userId: id });

      return _map(res, ({ _doc }) => _doc);
    },
  },
  Folder: {
    id: ({ _id }) => _id,
  },
  Link: {
    id: ({ _id }) => _id,
  },
  FolderMutations,
  LinkMutations,
};

module.exports = { resolvers };
