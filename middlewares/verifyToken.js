const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = (req, res, next) => {
  const bearer = req.headers['authorization'];

  if (!bearer) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const [, token] = bearer.split(' ');

  jwt.verify(token, process.env.TOKEN_SERCRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(400).json({ message: 'Not Authorized.' });
    }

    const userId = decoded.userId;

    User.findById(id, {}, (err, user) => {
      if (err) next(err);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized.' });
      }

      req.userId = userId;

      next();
    });
  });
};

module.exports = verifyToken;
