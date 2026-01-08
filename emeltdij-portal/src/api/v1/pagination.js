const { ApiError } = require('../../errors/ApiError');

function parsePagination(query) {
  const pageRaw = query.page ?? '1';
  const limitRaw = query.limit ?? '50';

  const page = parseInt(String(pageRaw), 10);
  const limit = parseInt(String(limitRaw), 10);

  if (!Number.isFinite(page) || page < 1) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid page', {
      page: 'Must be an integer >= 1',
    });
  }

  if (!Number.isFinite(limit) || limit < 1 || limit > 200) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid limit', {
      limit: 'Must be an integer between 1 and 200',
    });
  }

  return { page, limit, offset: (page - 1) * limit };
}

module.exports = {
  parsePagination,
};

