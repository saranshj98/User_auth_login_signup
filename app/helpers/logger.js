const winston = require('winston');

const logger = winston.createLogger({
	transports: [ new winston.transports.Console() ],
	exceptionHandlers: [ new winston.transports.Console() ]
});

module.exports = logger;

/*
  log level
  fatal   - The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
  error   - Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
  warn    - A note on something that should probably be looked at by an operator eventually.
  info    - Detail on regular operation.
  debug   - Anything else, i.e. too verbose to be included in “info” level.
  trace   - Logging from external libraries used by your app or very detailed application logging.
*/
