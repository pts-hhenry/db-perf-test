const config = require('config');
const mongoose = require('mongoose');
const log = require('./log');

const {
  mongoDb: { dbName, domain, password, port, schema, user }
} = config.get('db');

const initMongoConnect = async () => {
  try {
    const url = `${schema}${user}:${password}@${domain}:${port}/${dbName}?authSource=admin&w=1 `;
    await mongoose.connect(url);
  } catch (error) {
    log.error(error);
  }
};

module.exports = initMongoConnect;
