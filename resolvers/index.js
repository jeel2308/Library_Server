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
    folder: async (root, args, context) => {
      const { id } = args;
      const {
        dataSources: { folders },
      } = context;

      const { _doc: folder } = await folders.findOneById(id);
      return folder;
    },
    link: async (root, args, context) => {
      const { id } = args;
      const {
        dataSources: { links },
      } = context;

      const { _doc: link } = await links.findOneById(id);
      return link;
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
          return { ...user, type };
        }

        case 'FOLDER': {
          const { _doc } = await folders.findOneById(id);

          return { ..._doc, type };
        }

        case 'LINK': {
          const { _doc } = await links.findOneById(id);
          return { ..._doc, type };
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

        default: {
          return null;
        }
      }
    },
  },
  User: {
    id: ({ _id }) => _id,
  },
  Folder: {
    id: ({ _id }) => _id,
  },
  Link: {
    id: ({ _id }) => _id,
  },
};

module.exports = { resolvers };
