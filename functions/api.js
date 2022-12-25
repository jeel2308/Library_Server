/**--external-- */
const serverless = require('serverless-http');

/**--relative-- */
const { httpServer, app } = require('../index');
const {
  getApolloServer,
  getMongoConnectionPromise,
} = require('../serverDependencies');

let isApolloServerReady = false;
let isMongoDbReady = false;

const mongoConnectionPromise = getMongoConnectionPromise();

const apolloServer = getApolloServer({ httpServer });

const serverFunction = serverless(httpServer);

module.exports.handler = async function (...params) {
  if (!isMongoDbReady) {
    await mongoConnectionPromise;
    console.log('Mongodb is connected');
    isMongoDbReady = true;
  }

  if (!isApolloServerReady) {
    await apolloServer.start();
    /**
     * Internally, it registers route middleware for /graphql route on app.
     */
    apolloServer.applyMiddleware({ app });
    console.log('Apollo server started');
    isApolloServerReady = true;
  }

  return serverFunction(...params);
};
