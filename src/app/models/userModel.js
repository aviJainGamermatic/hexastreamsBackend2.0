const mongoose = require('mongoose');

const newLocal = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userModelSchema = new mongoose.Schema(
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
        unique: [true, 'email already exists in database!'],
        match:newLocal
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
        type: String
      },
      organization: {
        type: String,
      },
    },
    {timestamps: true},
);

module.exports = mongoose.model('user', userModelSchema);
