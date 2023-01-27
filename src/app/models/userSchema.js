const mongoose = require('mongoose');

const newLocal = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        unique: [true, 'email already exists in database!'],
        match:newLocal
      },
      phoneNumber: {
        type: Number,
      },
      password: {
        type: String,
      },
      created: {
        type: String,
      },
      lastActive: {
        type: String,
        required: false,
      },
      otp: {
        type: String,
        required: true,
      },
      organization: {
        type: String,
      },
    },
    {timestamps: true},
);

module.exports = mongoose.model('user', userSchema);
