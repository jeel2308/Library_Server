const verifyToken = require('./verifyToken');
const globalErrorHandler = require('./globalErrorHandler');
const setCsp = require('./setCsp');
const {
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
  setupTokenInResponseOfLogin,
} = require('./setupTokenInResponse');
module.exports = {
  verifyToken,
  globalErrorHandler,
  setCsp,
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
  setupTokenInResponseOfLogin,
};
