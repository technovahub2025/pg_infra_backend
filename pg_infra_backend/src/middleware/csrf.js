const crypto = require('crypto');
const { isProductionLike } = require('../utils/env');

const CSRF_COOKIE = 'pg-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function createCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

function csrfCookieOptions() {
  const productionLike = isProductionLike();
  return {
    httpOnly: false,
    secure: productionLike,
    sameSite: productionLike ? 'none' : 'lax',
  };
}

function issueCsrfToken(req, res, next) {
  if (!req.cookies?.[CSRF_COOKIE]) {
    res.cookie(CSRF_COOKIE, createCsrfToken(), csrfCookieOptions());
  }
  next();
}

function requireCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const exemptPaths = new Set([
    '/api/auth/refresh-token',
    '/api/auth/logout',
  ]);
  if (exemptPaths.has(req.originalUrl || req.url)) {
    return next();
  }

  const hasBearerAuth = Boolean(String(req.headers.authorization || '').startsWith('Bearer '));
  if (hasBearerAuth) {
    return next();
  }

  const hasCookieAuth = Boolean(req.cookies?.refreshToken || req.cookies?.accessToken);
  if (!hasCookieAuth && !hasBearerAuth) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'] || req.headers['csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed',
    });
  }

  return next();
}

module.exports = {
  CSRF_COOKIE,
  createCsrfToken,
  issueCsrfToken,
  requireCsrf,
};
