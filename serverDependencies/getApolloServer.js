/**--external-- */
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

/**--relative-- */
const { resolvers } = require('../resolvers');
const { typeDefs } = require('../schema');
const buildDataLoaders = require('../dataloaders');

const getApolloServer = ({ httpServer }) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        user: req.user,
        loaders: buildDataLoaders(),
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
};

module.exports = { getApolloServer };
