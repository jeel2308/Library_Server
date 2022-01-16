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
      } = context;

      const { id, type } = input;

      switch (type) {
        case 'USER': {
          const user = await users.load(id);

          return user;
        }

        default: {
          return input;
        }
      }
    },
    multiNode: (root, args) => {
      const {
        input: { ids, type },
      } = args;
      return ids.map((id) => {
        return { id, type };
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
