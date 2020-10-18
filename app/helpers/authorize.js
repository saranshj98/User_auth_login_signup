const jwt = require('jsonwebtoken');
const { secretKeyValue } = require('../../config/config');
const constant = require('../../constants/constant');
const logger = require('./logger');

/**
 * verifying the jwt token
 */
function authorization(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res
      .status(constant.statusCode.INTERNAL_SERVER)
      .send({ error: true, message: 'No token provided' });
  }
  jwt.verify(token, secretKeyValue, function (err, decoded) {
    if (err) {
      logger.error(err);
      return res.status(constant.statusCode.INTERNAL_SERVER).send({
        error: true,
        message: 'Failed to authenticate token.'
      });
    } else if (decoded && decoded.user) {
      req.body = decoded.user;
    } else {
      return res.status(constant.statusCode.INTERNAL_SERVER).send({
        error: true,
        message: constant.messages.SOMETHING_WENT_WRONG
      });
    }
    next();
  });
}

module.exports = authorization;
