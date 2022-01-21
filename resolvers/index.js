const { omit, isEmpty } = require('lodash');
const resolvers = {
  Query: {
    user: async (root, args, context, info) => {
      const {
        loaders: { users },
      } = context;

      const { id } = args;

      const user = await users.load(id);

      return user;
    },
    node: async (root, args, context, info) => {
      const { input } = args;
      const {
        loaders: { users },
        dataSources: { folders, links },
      } = context;

      const { id, type } = input;

      switch (type) {
        case 'USER': {
          const user = await users.load(id);
          return user;
        }

        case 'FOLDER': {
          const folder = await folders.findById(id);
          return folder;
        }

        case 'LINK': {
          const link = await links.findById(id);
          return link;
        }

        default: {
          return input;
        }
      }
    },
    multiNode: async (root, args, context) => {
      const {
        input: { ids, type },
      } = args;

      const {
        dataSources: { folders, links },
      } = context;

      switch (type) {
        case 'FOLDER': {
          const data = await folders.findManyByIds(ids);
          return data;
        }

        case 'LINK': {
          const data = await links.findManyByIds(ids);
          return data;
        }

        default: {
          return ids.map((id) => {
            return { id, type };
          });
        }
      }
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

        case 'RESOURCE': {
          return 'Resource';
        }
        default: {
          return null;
        }
      }
    },
  },
  Resource: {
    url: () => 'random',
    tag: () => 'random',
  },
  User: {
    id: ({ _id }) => _id,
  },
};

module.exports = { resolvers };
