/**--external--*/
const _map = require('lodash/map');

/**--relative--*/
const FolderMutations = require('./FolderMutationsResolver');
const LinkMutations = require('./LinkMutationsResolver');

const resolvers = {
  Query: {
    user: async (root, context, info) => {
      const {
        dataSources: { users },
        user: userData,
      } = context;

      const id = userData._id;

      const { _doc: user } = await users.findOneById(id);

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
        dataSources: { folders, links, users },
      } = context;

      const { id, type } = input;

      let data = {};

      switch (type) {
        case 'USER': {
          data = await users.findOneById(id);
        }

        case 'FOLDER': {
          data = await folders.findOneById(id);
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
        }

        case 'LINK': {
          data = await links.findManyByIds(ids);
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
      console.log(obj);
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
    folders: async (parent, _, context) => {
      const {
        dataSources: { folders },
        user: userData,
      } = context;

      const id = userData._id;

      const folders = await folders.findByFields({ userId: id });

      return _map(folders, ({ _doc }) => _doc);
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
