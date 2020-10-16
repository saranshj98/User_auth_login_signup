const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 3000;
const logger = require('./app/helpers/logger');
require('./config/mongoDb.config');

const routes = require('./app/routes');
const errorHandler = require('./app/helpers/error-handler');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	return res.send('Hello world');
});

// api routes
app.use('/', routes);

// global error handler
app.use(errorHandler);

// start server
const server = app.listen(port, () => {
	logger.info(`server on port ${port}`);
});

module.exports = app;
