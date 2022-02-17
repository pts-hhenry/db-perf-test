const config = require('config');
const nano = require('nano');

const {
  couchDb: { baseDomain, password, port, schema, user }
} = config.get('db');

const options = {
  url: `${schema}${user}:${password}@${baseDomain}:${port}`
};

module.exports = nano(options);
