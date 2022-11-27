const verifyToken = require('./verifyToken');
const globalErrorHandler = require('./globalErrorHandler');
const setCsp = require('./setCsp');
const {
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
} = require('./setupTokenInResponse');
module.exports = {
  verifyToken,
  globalErrorHandler,
  setCsp,
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
};
