const serverless = require('serverless-http');

const { httpServer } = require('../index');

module.exports.handler = serverless(httpServer);
