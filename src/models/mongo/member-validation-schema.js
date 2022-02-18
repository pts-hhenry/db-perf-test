const { Schema } = require('mongoose');

const MemberValidations = new Schema({
  accountStatus: {
    type: String
  },
  createdAt: {
    type: Date
  },
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  id: {
    type: String
  },
  isEmailVerified: {
    type: Boolean
  },
  lastName: {
    type: String
  },
  randomId: {
    type: String
  },
  updatedAt: {
    type: Date
  }
});

module.exports = MemberValidations;
