module.exports = {
  up: async (queryInterface, dataTypes) => {
    const { BOOLEAN, DATE, STRING, UUID, UUIDV4 } = dataTypes;

    // Create `users` table
    await queryInterface.createTable('member_validations', {
      accountStatus: {
        field: 'account_status',
        type: STRING
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: DATE
      },
      email: {
        allowNull: false,
        type: STRING
      },
      firstName: {
        field: 'first_name',
        type: STRING
      },
      id: {
        defaultValue: UUIDV4,
        type: UUID
      },
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
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: DATE
      }
    });
  }
};
