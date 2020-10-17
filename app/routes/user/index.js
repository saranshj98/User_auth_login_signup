const users = require('express').Router();
const get = require('./get');
const post = require('./post');
const schemaValidator = require('../../helpers/schemaValidator');
const authorization = require('../../helpers/authorize');

users.post('/signup', schemaValidator.validator('userSignUp'), post.createUser);
users.post('/login', schemaValidator.validator('userLogin'), post.login);
users.get('/', authorization, get.getAll);
users.get('/:id', authorization, get.getById);

module.exports = users;
