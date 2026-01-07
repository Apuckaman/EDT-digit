const { ApiError } = require('../errors/ApiError');
const { User } = require('../models');

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return next(ApiError.unauthorized());
  }

  const user = await User.findByPk(req.session.userId);
  if (!user || !user.active) {
    req.session.userId = null;
    return next(ApiError.unauthorized());
  }

  req.user = {
    id: user.id,
    role: user.role,
    clientId: user.clientId,
  };

  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return next(ApiError.unauthorized());
  if (req.user.role !== 'ADMIN') return next(ApiError.forbidden());
  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};

