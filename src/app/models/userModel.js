const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema;
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['host', 'gamer'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    lastActive: {
      type: String,
    },
    otp: {
      type: String,
    },
    organization: {
      type: String,
    },
    isPaidUser: {
      type: Boolean,
      // required: true,
    },
    linkedAccounts: [{
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;