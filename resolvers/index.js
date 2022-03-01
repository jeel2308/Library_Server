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
      const { edges } = parent;
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
      });

      return { endCursor, hasNextPage };
    },
  },
  FolderMutations,
  LinkMutations,
};

module.exports = { resolvers };
