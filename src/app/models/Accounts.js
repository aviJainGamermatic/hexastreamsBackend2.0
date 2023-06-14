const mongoose = require('mongoose');
// const {ObjectId} = mongoose.Schema;
const { Schema, model } = mongoose;


const AccountSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
type: {
    type: String,
    required: true
  },
  authID: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const Account = model('Account', AccountSchema);

module.exports = Account;