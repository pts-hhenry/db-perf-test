const express = require('express');
const responseTime = require('response-time');
const log = require('./utils/log');
const initMongoConnection = require('./utils/mongo-db');
const requestLogger = require('./views/middleware/request-logger');
const handleMemberValidations = require('./views/routes/handlers/member-validations');
const handleNotFound = require('./views/routes/handlers/not-found');

initMongoConnection();

const app = express();

app.use(responseTime());
app.use(requestLogger());

app.use('/member-validations', handleMemberValidations);

// Fallback 404 route
app.use('/*', handleNotFound);

app.listen(3000, () => log.info(`Server started on port 3000`));
