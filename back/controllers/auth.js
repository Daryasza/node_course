const crypto = require('crypto')
const serverConfig = require('../config/server.config.js');
const Token = require('../models/token.js');
const User = require('../models/user.js');

function umbac(permission, uri, method) {
  uri = uri.split('/api')[1].split('/')[1];
  switch (uri) {
    case 'profile':
      return true;
    case 'users':
      if (method === 'GET')
        return permission.settings.R;
      else if (method === 'PATCH')
        return permission.settings.U;
      else if (method === 'DELETE')
        return permission.settings.D;
    case 'news':
      if (method === 'GET')
        return permission.news.R;
      else if (method === 'POST')
        return permission.news.C;
      else if (method === 'PATCH')
        return permission.news.U;
      else if (method === 'DELETE')
        return permission.news.D;
    default:
      return false;
  }
}

function generateToken() {
  return getHash((Date.now() + Math.random()).toString());
}

function getHash(str) {
  return crypto
    .createHash('sha256')
    .update(str)
    .digest('hex');
};
exports.getHash = getHash;

async function checkUserPassword(userId, password) {
  const user = await User.findById(userId)
  return getHash(password) === user.passwordHash
}
exports.checkUserPassword = checkUserPassword;

function scheduleAccessTokenExpiration() {
  return Date.now() + serverConfig.accessTokenLifetime;
}

function scheduleRefreshTokenExpiration() {
  return Date.now() + serverConfig.refreshTokenLifetime;
}

exports.issueTokens = (user) => {
  return new Token({
    user: user,
    accessToken: generateToken(),
    refreshToken: generateToken(),
    accessTokenExpiredAt: scheduleAccessTokenExpiration(),
    refreshTokenExpiredAt: scheduleRefreshTokenExpiration()
  });
};

async function authenticate(accessToken) {
  const token = await Token.findOne({ accessToken: accessToken }).exec();
  if (
    !token ||
    !token.accessTokenExpiredAt ||
    token.accessTokenExpiredAt.getTime() <= Date.now()
  ) return;
  return token;
}

async function authorize(token, uri, method) {
  try {
    const populatedToken = await token.populate('user');
    return umbac(populatedToken.user.permission, uri, method);
  } catch(err) {
    console.error(err);
    return false;
  }
  return true;
}

exports.checkAuth = async (req) => {
  var accessToken = null;

  if (req.headers?.authorization)
    accessToken = req.headers.authorization;
  else if (req.body?.accessToken)
    accessToken = req.body.accessToken;
  else
  return {
    code: 401,
    message: "The user is not authenticated"
  };

  const token = await authenticate(accessToken);
  if (!token || !await authorize(token, req.url, req.method))
    return {
      code: 403,
      message: "Access denied"
    };

  return { accessToken };
};

exports.refreshToken = async (accessToken, refreshToken) => {
  const token = await Token.findOne({ refreshToken: refreshToken }).exec();
  try {
    if (
      token.accessToken != accessToken ||
      token.refreshTokenExpiredAt.getTime() <= Date.now()
    ) return null;

    token.accessToken = generateToken();
    token.accessTokenExpiredAt = scheduleAccessTokenExpiration();
    const refreshedToken = await token.save();

    return {
      accessToken: refreshedToken.accessToken,
      refreshToken: refreshedToken.refreshToken,
      accessTokenExpiredAt: refreshedToken.accessTokenExpiredAt,
      refreshTokenExpiredAt: refreshedToken.refreshTokenExpiredAt
    }
  } catch { return null; }
};

exports.getUserIdByAccessToken = async (accessToken) => {
  const token = await Token.findOne({ accessToken }).exec();
  return token.user?._id;
};
