/**--external-- */
const dotEnv = require('dotenv');
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');

/**--relative-- */
const initMailTransporter = require('./mailTransporters');
const { userRoutes, pingRoutes, cspRoutes } = require('./routes');
const { verifyToken, globalErrorHandler, setCsp } = require('./middleware');
const {
  getApolloServer,
  getMongoConnectionPromise,
} = require('./serverDependencies');

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
  'http://localhost:8888',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
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

const startLocalServer = async ({ httpServer, app }) => {
  await getMongoConnectionPromise();
  console.log('MongoDB connected');

  const apolloServer = getApolloServer({ httpServer });
  await apolloServer.start();
  /**
   * Internally, it registers route middleware for /graphql route on app.
   */
  apolloServer.applyMiddleware({ app });
  console.log('Apollo Server started');

  await httpServer.listen({ port: process.env.PORT });
  console.log('Express server started');
};

/**
 * Instead of using app.listen, we are creating httpServer. httpServer requires a function which
 * handles req and res. Here we are using app for that purpose.
 * So, when request arrives control will flow in this way:
 * httpServer -> app -> middleware ->apollo server
 */
const httpServer = http.createServer(app);

if (process.env.NODE_ENV === 'LOCAL' && !process.env.NETLIFY_DEV) {
  startLocalServer({ httpServer, app });
}

module.exports = { httpServer, app };
