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
        id: user.id
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
const login = async (req, res) => {};

module.exports = {
  createUser,
  login
};
