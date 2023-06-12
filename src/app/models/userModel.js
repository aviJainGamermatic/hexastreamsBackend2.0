const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newLocal = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    userType: {
      type: String,
      enum: ['host', 'gamer'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'email already exists in the database!'],
      match: newLocal,
    },
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    lastActive: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
    },
    organization: {
      type: String,
    },
    linkedAccounts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
