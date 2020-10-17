const Joi = require('@hapi/joi');
const constant = require('../../constants');

const validator = (schemaName) => {
  return async (req, res, next) => {
    let validationResult = schemaDefinition[schemaName].validate(req.body);
    if (validationResult && validationResult.error) {
      return res.status(constant.statusCode.VALIDATION).send('invalid request');
    }
    next();
  };
};

const schemaDefinition = {
  userSignUp: Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).required().strict(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .strict(),
    organizationName: Joi.string().min(1).required()
  }),
  userLogin: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).required().strict(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .strict(),
    organizationName: Joi.string()
  })
};

module.exports = {
  validator
};
