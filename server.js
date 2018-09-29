const express       = require('express');
const app           = express();
const cors          = require('cors');
const bodyParser    = require('body-parser');

const routes        = require('./app/routes');
const jwt           = require('./_helpers/jwt');
const errorHandler  = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/api', routes);


// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 8080;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
