const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message });
};

module.exports = globalErrorHandler;
