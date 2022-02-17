const config = require('config');
const { camelize, pluralize, singularize, underscore } = require('inflection');
const _ = require('lodash');
const Sequelize = require('sequelize');
const log = require('../utils/log');

const {
  postgres: { name, pass, user, options }
} = config.get('db');
const sequelize = new Sequelize(name, user, pass, options);

sequelize.addHook('beforeSync', (instance) => {
  const modelName = _.get(instance, 'name.plural', '');

  if (modelName !== 'db_migrations') {
    log.error('DB sync not allowed -- use migrations instead');
    process.exit(1);
  }
});

sequelize.addHook('beforeBulkUpdate', (instance) => {
  // eslint-disable-next-line
  instance.fields.push('updatedAt');
  // eslint-disable-next-line
  instance.attributes.updatedAt = new Date().toISOString();
});

sequelize.addHook('beforeDefine', (attributes, model) => {
  const { modelName } = model;
  const acceptableModelName = pluralize(underscore(modelName));

  /**
   * SQL code style
   * Ensure SQL table is formatted using collective (or plural) lower underscore case
   */
  if (modelName !== acceptableModelName) {
    log.error(
      '' +
        `[SQL code style] model "${modelName}" must be defined with lower_underscore_case ` +
        `in the collective or plural form (eg. "${acceptableModelName}")` +
        ''
    );
  }

  const attributeErrors = [];
  _.forEach(attributes, (value, key) => {
    const acceptableAttributeName = singularize(camelize(key, true));
    const tableColumnName = underscore(acceptableAttributeName);
    const { field } = value;
    const error = {};

    if (key !== acceptableAttributeName) {
      error.attributeName = key;
      error.suggestedAttributeName = acceptableAttributeName;
      attributeErrors.push(error);
    } else if (
      acceptableAttributeName !== tableColumnName &&
      field !== tableColumnName
    ) {
      error.attributeName = key;
      error.missingTableColumnName = tableColumnName;
      attributeErrors.push(error);
    }
  });

  if (attributeErrors.length) {
    const invalidAttributes = attributeErrors
      .map((error) => {
        const {
          attributeName,
          missingTableColumnName,
          suggestedAttributeName
        } = error;
        if (suggestedAttributeName) {
          return (
            '' +
            `- [formatting]: attribute "${attributeName}" must be defined with camelCase ` +
            `in the singular form (eg. ${suggestedAttributeName})`
          );
        }

        return (
          '' +
          ` - [missing "field" property]: camelCased attribute "${attributeName}" must include ` +
          'a lower_underscore_cased field property (table column name). ' +
          `(eg. { ${attributeName}: { field: ${missingTableColumnName}, ... } })`
        );
      })
      .join('\n');

    log.error(
      '' +
        `[SQL code style] model "${modelName}" contains ` +
        `improperly defined attributes:\n${invalidAttributes}\n` +
        ''
    );
    process.exit(1);
  }
});

module.exports = sequelize;
