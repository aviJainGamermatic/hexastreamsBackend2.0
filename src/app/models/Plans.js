const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  
});

module.exports = mongoose.model('Plans', PlanSchema);

