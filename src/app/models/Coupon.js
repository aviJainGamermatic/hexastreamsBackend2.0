const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discountpercentage: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
  
});

module.exports= mongoose.model("Coupon", CouponSchema);