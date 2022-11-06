/**--external--*/
const _map = require('lodash/map');
const _last = require('lodash/last');
const _isEmpty = require('lodash/isEmpty');

/**--internal-- */
const { encodeToBase64 } = require('../utils');

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
const {
  findLinkById,
  findLinksByIds,
  findLinksByFilters,
  getTotalLinkCountsByFilters,
  getNextLinkPresenceStatus,
} = require('../services/link/controllers');

const resolvers = {
  Query: {
    node: async (root, args) => {
      const { input } = args;

      const { id, type } = input;

      let data = {};

      switch (type) {
        case 'USER': {
          data = await findSingleUserById({ id });
          break;
        }

        case 'FOLDER': {
          data = await findSingleFolderById({ id });
          break;
        }

        case 'LINK': {
          data = await findLinkById({ id });
          break;
        }
      }
      return { ...data, type };
    },
    multiNode: async (root, args) => {
      const {
        input: { ids, type },
      } = args;

      let data = [];

      switch (type) {
        case 'FOLDER': {
          data = await findMultipleFoldersById({ ids });
          break;
        }

        case 'LINK': {
          data = await findLinksByIds({ ids });
          break;
        }

        case 'USER': {
          data = await findMultipleUsersById({ ids });
        }
      }
      return _map(data, (item) => {
        return { ...item, type };
      });
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
    links: async (parent, args) => {
      const id = parent._id;
      return await findLinksByFilters({
        folderId: id,
        filters: args?.input ?? {},
      });
    },
    linksV2: async (parent, args) => {
      const folderId = parent._id;
      const filters = args?.input ?? {};
      const edges = await findLinksByFilters({ folderId, filters });

      return { folderId, edges, filters };
    },
  },
  Link: {
    id: ({ _id }) => _id,
  },
  LinkWrapper: {
    totalCount: async (parent) => {
      const { filters } = parent;
      const { folderId } = parent;
      return await getTotalLinkCountsByFilters({
        folderId,
        filters,
      });
    },
    edges: (parent) => {
      const { edges } = parent;
      return _map(edges, (link) => {
        const { _id } = link;
        return { node: link, cursor: encodeToBase64({ text: _id }) };
      });
    },
    pageInfo: async (parent) => {
      const { edges, filters, folderId } = parent;
      if (_isEmpty(edges)) {
        return { endCursor: null, hasNextPage: false };
      }
      const lastLinkId = _last(edges)._id;

      const endCursor = encodeToBase64({ text: lastLinkId });

      const hasNextPage = await getNextLinkPresenceStatus({
        folderId,
        filters,
        cursor: endCursor,
      });

      return { endCursor, hasNextPage };
    },
  },
  FolderMutations,
  LinkMutations,
  UserMutations,
};

module.exports = { resolvers };
