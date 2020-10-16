const env = require('./config.json')['environment'];
const config = require('./config.json')[env];

module.exports = config;
//to sign and verify jwt tokens - secret key in config
