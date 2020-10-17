const users = require('express').Router();
const get = require('./get');
const post = require('./post');
const schemaValidator = require('../../helpers/schemaValidator');

users.post('/signup', schemaValidator.validator('userSignUp'), post.createUser);
users.post('/login', schemaValidator.validator('userLogin'), post.login);

module.exports = users;
