import mongoose from "mongoose";
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

