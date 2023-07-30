const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' ,
    default:[]
  }],
  joinedUsers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' ,
    default:[]
  }],
  deletedAt: {
    type: Date
  },
  secretCodeToJoin:{
    type:String
  },
  isDeleted:{
    type: Boolean,
    default:false
  }

});

teamSchema.path('name').validate(function(value) {
  return value.length > 0;
}, 'Name cannot be blank');

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;