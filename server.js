const express       = require('express');
const app           = express();
const cors          = require('cors');
const bodyParser    = require('body-parser');

const routes        = require('./app/routes');
const errorHandler  = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/api', routes);


// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT ? process.env.PORT : 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});