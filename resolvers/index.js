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
  findLinksByFilters,
  getTotalLinkCountsByFilters,
  getNextLinkPresenceStatus,
} = require('../services/link/controllers');
const {
  aggregateFolderIdsByUserIds,
} = require('../services/folder/controllers');

const resolvers = {
  Query: {
    node: async (root, args, context) => {
      const { input } = args;
      const { id, type } = input;

      const {
        loaders: { loadUserById, loadFolderById, loadLinkById },
      } = context;

      let data = {};

      switch (type) {
        case 'USER': {
          data = await loadUserById.load(id);
          break;
        }

        case 'FOLDER': {
          data = await loadFolderById.load(id);
          break;
        }

        case 'LINK': {
          data = await loadLinkById.load(id);
          break;
        }
      }
      return { ...data, type };
    },
    multiNode: async (root, args, context) => {
      const {
        input: { ids, type },
      } = args;

      const {
        loaders: { loadUserById, loadFolderById, loadLinkById },
      } = context;

      let data = [];

      switch (type) {
        case 'FOLDER': {
          data = await loadFolderById.loadMany(ids);
          break;
        }

        case 'LINK': {
          data = await loadLinkById.loadMany(ids);
          break;
        }

        case 'USER': {
          data = await loadUserById.loadMany(ids);
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
    folders: async (parent, args, context) => {
      const {
        loaders: { loadFolderById },
      } = context;

      const id = parent._id;
      const [{ folders }] = await aggregateFolderIdsByUserIds({
        userIds: [id],
      });
      const folderIds = _map(folders, ({ _id }) => _id);
      return loadFolderById.loadMany(folderIds);
    },
  },
  Folder: {
    id: ({ _id }) => _id,
    links: async (parent, args, context) => {
      const {
        loaders: { loadLinkById },
      } = context;

      const id = parent._id;

      const links = await findLinksByFilters({
        folderId: id,
        filters: args?.input ?? {},
      });
      const linkIds = _map(links, ({ _id }) => _id);
      return await loadLinkById.loadMany(linkIds);
    },
    linksV2: async (parent, args, context) => {
      const {
        loaders: { loadLinkById },
      } = context;

      const folderId = parent._id;
      const filters = args?.input ?? {};
      const links = await findLinksByFilters({ folderId, filters });
      const linkIds = _map(links, ({ _id }) => _id);
      const edges = await loadLinkById.loadMany(linkIds);

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
  DeleteFolderResponse: {
    id: ({ _id }) => _id,
  },
  DeleteLinkResponse: {
    id: ({ _id }) => _id,
  },
  FolderMutations,
  LinkMutations,
  UserMutations,
};

module.exports = { resolvers };
