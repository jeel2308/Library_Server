const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode, message } = err;
  res.status(statusCode).send({ message });
};

module.exports = globalErrorHandler;
