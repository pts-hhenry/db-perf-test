const config = require('config');
const mongoose = require('mongoose');

const {
  mongo: { dbName, domain, password, port, schema, user }
} = config.get('db');

mongoose.connect(`${schema}${user}:${password}@${domain}:${port}/${dbName}`);

module.exports = mongoose.connection;
