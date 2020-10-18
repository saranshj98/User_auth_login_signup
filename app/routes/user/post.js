const User = require('../../model/user');
const logger = require('../../helpers/logger');
const jwt = require('jsonwebtoken');
const { secretKeyValue } = require('../../../config/config');
const constant = require('../../../constants/constant');

/**
 * user try to signup
 * @param {*} req
 * @param {*} res
 */
async function createUser(req, res) {
  const { email, password } = req.body;
  try {
    let userDoc = await User.findOne({ email });

    if (userDoc) {
      return res.status(constant.statusCode.BAD_REQUEST).json({
        error: true,
        message: 'User Already Exists'
      });
    }

    let user = new User(req.body);
    user.password = user.generateHash(password);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      secretKeyValue,
      {
        expiresIn: 10000
      },
      (err, token) => {
        if (err) throw err;
        return res.status(constant.statusCode.OK).send({
          token
        });
      }
    );
  } catch (error) {
    logger.error(error);
    res
      .status(constant.statusCode.INTERNAL_SERVER)
      .send('Internal server error');
  }
}

/**
 * user try to login
 * @param {*} req
 * @param {*} res
 */
async function login(req, res) {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(constant.statusCode.BAD_REQUEST).json({
        error: true,
        message: 'User Not Exist'
      });
    }

    const isMatch = user.validPassword(password, user.password);
    if (!isMatch) {
      return res.status(constant.statusCode.BAD_REQUEST).json({
        error: true,
        message: 'Incorrect Password !'
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      secretKeyValue,
      {
        expiresIn: 10000
      },
      (err, token) => {
        if (err) throw err;
        return res.status(constant.statusCode.OK).json({
          token
        });
      }
    );
  } catch (error) {
    logger.error(error);
    res.status(constant.statusCode.INTERNAL_SERVER).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  createUser,
  login
};
