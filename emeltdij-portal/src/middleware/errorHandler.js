const { ApiError } = require('../errors/ApiError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err instanceof ApiError ? err.status : 500;
  const code = err instanceof ApiError ? err.code : 'INTERNAL_ERROR';
  const message =
    err instanceof ApiError ? err.message : 'Internal server error';
  const details = err instanceof ApiError ? err.details : {};

  res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
}

module.exports = { errorHandler };
