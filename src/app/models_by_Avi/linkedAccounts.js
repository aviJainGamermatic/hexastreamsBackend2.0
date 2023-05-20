const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const linkedAccountSchema = new mongoose.Schema({
    User : {type : ObjectId, ref : "User"},

    accounts : [
        {
            account : {
                type: ObjectId,
                ref : 'Account'
            },
            count : Number,
        }
    ],

   
  },{timestamps : true});


  module.exports = mongoose.model('LinkedAccounts',linkedAccountSchema );