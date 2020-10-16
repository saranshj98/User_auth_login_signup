const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../app/helpers/logger');

function connect() {
	mongoose.Promise = Promise;
	mongoose.connect(
		config.mongoDBURL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		},
		(error) => {
			if (error) {
				logger.error(error);
			} else {
				logger.info('mongodb connected successfully');
			}
		}
	);
}

connect();
