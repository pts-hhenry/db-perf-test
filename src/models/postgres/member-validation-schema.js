const Sequelize = require('sequelize');
const db = require('../../utils/postgres-db');
const commonAttributes = require('./common/attributes');

const { BOOLEAN, STRING, UUID } = Sequelize;
const { createdAt, id, updatedAt } = commonAttributes;

const MemberValidations = db.define('member_validations', {
  accountStatus: {
    field: 'account_status',
    type: STRING
  },
  createdAt,
  email: {
    allowNull: false,
    type: STRING
  },
  firstName: {
    field: 'first_name',
    type: STRING
  },
  id,
  isEmailVerified: {
    allowNull: false,
    defaultValue: false,
    field: 'is_email_verified',
    type: BOOLEAN
  },
  lastName: {
    field: 'last_name',
    type: STRING
  },
  randomId: {
    allowNull: false,
    field: 'random_id',
    type: UUID
  },
  updatedAt
});

module.exports = MemberValidations;
