const { ApiError } = require('../errors/ApiError');

function notFound(req, res, next) {
  next(ApiError.notFound());
}

module.exports = { notFound };
