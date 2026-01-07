class ApiError extends Error {
  /**
   * @param {number} status
   * @param {string} code
   * @param {string} message
   * @param {Record<string, any>} [details]
   */
  constructor(status, code, message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(code, message, details = {}) {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message = 'Authentication required', details = {}) {
    return new ApiError(401, 'UNAUTHORIZED', message, details);
  }

  static forbidden(message = 'Forbidden', details = {}) {
    return new ApiError(403, 'FORBIDDEN', message, details);
  }

  static notFound(message = 'Not found', details = {}) {
    return new ApiError(404, 'NOT_FOUND', message, details);
  }
}

module.exports = { ApiError };
