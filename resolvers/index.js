/**--external--*/
const _map = require('lodash/map');
const _last = require('lodash/last');
const _isEmpty = require('lodash/isEmpty');
const _omit = require('lodash/omit');

/**--internal-- */
const { encodeToBase64, decodeFromBase64 } = require('../utils');

/**--relative--*/
const FolderMutations = require('./FolderMutationsResolver');
const LinkMutations = require('./LinkMutationsResolver');
const UserMutations = require('./UserMutationsResolver');
const {
  findSingleFolderById,
  findMultipleFoldersById,
  findMultipleFoldersByUserId,
} = require('../services/folder/controllers');
const {
  findSingleUserById,
  findMultipleUsersById,
} = require('../services/auth/controllers');

const resolvers = {
  Query: {
    node: async (root, args, context) => {
      const { input } = args;
      const {
        dataSources: { links },
      } = context;

      const { id, type } = input;

      let data = {};

      switch (type) {
        case 'USER': {
          data = await findSingleUserById({ id });
          return { ...data, type };
        }

        case 'FOLDER': {
          data = await findSingleFolderById({ id });
          return { ...data, type };
        }

        case 'LINK': {
          data = await links.findOneById(id);
          const { _doc } = data;
          return { ..._doc, type };
        }
      }
    },
    multiNode: async (root, args, context) => {
      const {
        input: { ids, type },
      } = args;

      const {
        dataSources: { links },
      } = context;

      let data = [];

      switch (type) {
        case 'FOLDER': {
          data = await findMultipleFoldersById({ ids });
          return _map(data, (item) => {
            return { ...item, type };
          });
        }

        case 'LINK': {
          data = await links.findManyByIds(ids);
          return _map(data, (item) => {
            const { _doc } = item;
            return { ..._doc, type };
          });
        }

        case 'USER': {
          data = await findMultipleUsersById({ ids });
          return _map(data, (item) => {
            return { ...item, type };
          });
        }
      }
    },
  },
  Node: {
    __resolveType: (obj) => {
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
    userManagement: () => ({}),
  },
  User: {
    id: ({ _id }) => _id,
    folders: async (parent) => {
      const id = parent._id;
      return await findMultipleFoldersByUserId({ userId: id });
    },
  },
  Folder: {
    id: ({ _id }) => _id,
    links: async (parent, args, context) => {
      const {
        dataSources: { links },
      } = context;

      const id = parent._id;

      const res = await links.findLinks({
        folderId: id,
        ...(args?.input ?? {}),
      });

      return _map(res, ({ _doc }) => _doc);
    },
    linksV2: async (parent, args, context) => {
      const {
        dataSources: { links },
      } = context;
      const folderId = parent._id;
      const filters = args?.input ?? {};
      let updatedFilters = { ...filters };
      if (filters.after) {
        updatedFilters.after = decodeFromBase64({ text: filters.after });
      }

      const edges = await links.findLinksV2({
        folderId,
        filters: updatedFilters,
      });

      return { folderId, edges, filters: updatedFilters };
    },
  },
  Link: {
    id: ({ _id }) => _id,
  },
  LinkWrapper: {
    totalCount: async (parent, _, context) => {
      const {
        dataSources: { links },
      } = context;
      const { filters } = parent;
      const { folderId } = parent;
      const updatedFilters = {
        folderId,
        ..._omit(filters, ['after', 'first']),
      };
      const totalLinks = await links.getTotalLinks(updatedFilters);
      return totalLinks;
    },
    edges: (parent) => {
      const { edges } = parent;
      return _map(edges, (link) => {
        const { _id } = link;
        return { node: link, cursor: encodeToBase64({ text: _id }) };
      });
    },
    pageInfo: async (parent, _, context) => {
      const { edges, filters, folderId } = parent;
      if (_isEmpty(edges)) {
        return { endCursor: null, hasNextPage: false };
      }
      const lastLinkId = _last(edges)._id;

      const endCursor = encodeToBase64({ text: lastLinkId });
      const {
        dataSources: { links },
      } = context;

      const hasNextPage = await links.getNextLinkPresenceStatus({
        linkId: lastLinkId,
        folderId,
        ...filters,
      });

      return { endCursor, hasNextPage };
    },
  },
  FolderMutations,
  LinkMutations,
  UserMutations,
};

module.exports = { resolvers };
