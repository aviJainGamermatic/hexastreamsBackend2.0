const mongoose = require('mongoose');
// const {ObjectId} = mongoose.Schema;
const { Schema, model } = mongoose;


const AccountSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  }, 
  liveStreamId:{
    type: Schema.Types.ObjectId,
    ref: 'liveStream',
  },
type: {
    type: String,
    required: true
  },
  authID: {
    type: String,
    
  },
  token: {
    type: String,
    
  },
  title: {
    type: String,
    
  }
});

const Account = model('Account', AccountSchema);

module.exports = Account;
