const jwt = require('jsonwebtoken');

function createAuthenticateToken(jwtSecret) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '未提供token' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'token无效' });
      }
      req.user = user;
      next();
    });
  };
}

module.exports = {
  createAuthenticateToken,
};
