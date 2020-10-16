const users = require('express').Router();
const get = require('./get');
const post = require('./post');

users.post('/create', post.authUser);

module.exports = users;
