/**--external-- */
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const dotEnv = require('dotenv');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

/**--relative-- */
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./schema');
const initMailTransporter = require('./mailTransporters');
const buildDataLoaders = require('./dataloaders');
const { userRoutes, pingRoutes, cspRoutes } = require('./routes');
const { verifyToken, globalErrorHandler, setCsp } = require('./middleware');

const app = express();

dotEnv.config();

initMailTransporter();

/**
 * This will set Content-Security-Policy for each request
 */
app.use(setCsp);

/**
 * This will expose cookies on req.cookies
 */
app.use(cookieParser());

/**
 * This will allow request from only specific origins
 */
const whitelist = [
  'http://localhost:3000',
  'https://resource-library.netlify.app',
  'https://studio.apollographql.com',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback({ message: 'Not allowed by CORS', statusCode: 500 });
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

/**
 * This will add JSON payload in as req.body Object
 */
app.use(
  express.json({
    type: [
      'application/json',
      'application/csp-report',
      'application/reports+json',
    ],
  })
);
/**
 * This will populate URL encoded payload as req.body Object
 */
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);

app.use(pingRoutes);

app.use(cspRoutes);

app.use(verifyToken);

app.use(globalErrorHandler);

/**
 * Instead of using app.listen, we are creating httpServer. httpServer requires a function which
 * handles req and res. Here we are using app for that purpose.
 * So, when request arrives control will flow in this way:
 * httpServer -> app -> middleware ->apollo server
 */
const httpServer = http.createServer(app);

const { PASSWORD, DB } = process.env;

const DB_URL = `mongodb+srv://Jeel2308:${PASSWORD}@cluster0.erkx1.mongodb.net/${DB}?retryWrites=true&w=majority`;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongodb connected');

    const server = new ApolloServer({
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

    await server.start();

    console.log('Apollo server started');

    /**
     * Internally, it registers route middleware for /graphql route on app.
     */
    server.applyMiddleware({ app });

    await httpServer.listen({ port: process.env.PORT });
    console.log('Express server started');
  } catch (e) {
    console.log(e);
  }
};

startServer();

module.exports = app;
