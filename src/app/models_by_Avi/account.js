const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const AccountSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Account", AccountSchema);