const jwt = require('jsonwebtoken');
const { secretKeyValue } = require('../../config/config');

function authorization(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(500).send({ error: true, message: 'No token provided.' });
  } else {
    jwt.verify(token, secretKeyValue, function (err, decoded) {
      if (err) {
        return res.status(500).send({
          error: true,
          message: 'Failed to authenticate token.'
        });
      } else if (decoded && decoded.user) {
        req.body = decoded.user;
      } else {
        return res.status(500).send({
          error: true,
          message: 'Something went wrong.'
        });
      }
      next();
    });
  }
}

module.exports = authorization;
