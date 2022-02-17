const Sequelize = require('sequelize');

const { DATE, FLOAT, UUID, UUIDV4 } = Sequelize;

const baseDateAttributeOptions = {
  allowNull: false,
  defaultValue: Date.now(),
  type: DATE
};

const basePrimaryKeyAttributeOptions = {
  allowNull: false,
  type: UUID
};

const attributes = {
  createdAt: {
    ...baseDateAttributeOptions,
    field: 'created_at'
  },
  id: {
    ...basePrimaryKeyAttributeOptions,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  updatedAt: {
    ...baseDateAttributeOptions,
    field: 'updated_at'
  },
  userId: {
    ...basePrimaryKeyAttributeOptions,
    field: 'user_id'
  }
};

module.exports = attributes;
