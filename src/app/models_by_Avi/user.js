const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  isPaidUser: {
    type: Boolean,
    required: true
  },
  linkedAccounts: [
    {
      type: ObjectId,
      ref: 'Account'
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;