const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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

const MemberValidation = mongoose.model('MemberValidation', schema);

module.exports = MemberValidation;
