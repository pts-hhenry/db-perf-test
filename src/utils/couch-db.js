const config = require('config');
const nano = require('nano');

const {
  couchDb: { domain, password, port, schema, user }
} = config.get('db');

const options = {
  url: `${schema}${user}:${password}@${domain}:${port}`
};

module.exports = nano(options);
