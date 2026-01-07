const bcrypt = require('bcryptjs');

const { ApiError } = require('../../../errors/ApiError');
const { User } = require('../../../models');

function validateLoginPayload(body) {
  const details = {};
  if (typeof body.usernameOrEmail !== 'string' || body.usernameOrEmail.trim() === '') {
    details.usernameOrEmail = 'Required string';
  }
  if (typeof body.password !== 'string' || body.password === '') {
    details.password = 'Required string';
  }
  if (Object.keys(details).length) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid login payload', details);
  }
}

async function login(req, res) {
  validateLoginPayload(req.body);

  const username = req.body.usernameOrEmail.trim();
  const user = await User.findOne({ where: { username } });
  if (!user || !user.active) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const ok = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!ok) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  req.session.userId = user.id;

  res.json({
    user: { id: user.id, role: user.role, clientId: user.clientId ?? null },
  });
}

async function logout(req, res) {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => {
    res.json({ ok: true });
  });
}

async function me(req, res) {
  if (!req.session || !req.session.userId) {
    throw ApiError.unauthorized();
  }

  const user = await User.findByPk(req.session.userId);
  if (!user || !user.active) {
    throw ApiError.unauthorized();
  }

  res.json({
    user: { id: user.id, role: user.role, clientId: user.clientId ?? null },
  });
}

module.exports = {
  login,
  logout,
  me,
};

