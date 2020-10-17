const Joi = require('@hapi/joi');
const constant = require('../../constants/constant');

const validator = (schemaName) => {
  return async (req, res, next) => {
    let validationResult = schemaDefinition[schemaName].validate(req.body);
    if (validationResult && validationResult.error) {
      let msg = validationResult.error.details[0].message.replace(/"/g, '');
      if (msg.includes('confirmPassword')) {
        msg = 'password does not match.';
      }
      const errorObj = {
        error: true,
        message: msg
      };
      return res.status(constant.statusCode.VALIDATION).send(errorObj);
    }
    next();
  };
};

const schemaDefinition = {
  userSignUp: Joi.object({
    firstName: Joi.string().trim().min(1).required(),
    lastName: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().replace(/\s+/g, '').min(7).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    organizationName: Joi.string().trim().min(1).required()
  }),
  userLogin: Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().replace(/\s+/g, '').required()
  })
};

module.exports = {
  validator
};
