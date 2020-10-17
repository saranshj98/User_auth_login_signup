const User = require('../../model/user');
const logger = require('../../helpers/logger');
const jwt = require('jsonwebtoken');
const { secretKeyValue } = require('../../../config/config');

//user try to signup
async function createUser(req, res) {
  const { email, password } = req.body;
  try {
    let userDoc = await User.findOne({ email });

    if (userDoc) {
      return res.status(400).json({
        msg: 'User Already Exists'
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
        res.status(200).send({
          token
        });
      }
    );
  } catch (error) {
    logger.error(error);
    res.status(500).send('Internal server error');
  }
}

//user try to login
async function login(req, res) {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        message: 'User Not Exist'
      });
    }

    const isMatch = user.validPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
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
        res.status(200).json({
          token
        });
      }
    );
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  createUser,
  login
};
