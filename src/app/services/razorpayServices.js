const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const Plans = require("../models/Plans.js");
const Coupon = require("../models/Coupon.js");
const Razorpay= require ('razorpay');

//authenticating razorpay
var instance = new Razorpay({
    key_id: 'rzp_test_YqQ9om1jfcBSmS',
    key_secret: 'TWVoKnfd3izynbMibjJ2ipTT',
  });

module.exports={
 createPlan: async (req) => {
    const newPlan = new Plans(req.body);
  
    try {
      const savedPlan = await newPlan.save();
      return {
        status: true, code: 200, msg: "okan created", data: savedPlan,
      };
    } catch (err) {
      console.log(err);
    }
  },
  
  
   getPlan : async (req) => {
    try {
      const plan = await Plans.findById(req.params.id);
      return {
        status: true, code: 200, msg: "find plan", data: plan,
      };
    } catch (err) {
        console.log(err);
    }
  },

   getPlans : async (req) => {
    try {
      const plans = await Plans.find();
      return {
        status: true, code: 200, msg: "find all plans", data: plans,
      };
    } catch (err) {
        console.log(err);
    }
  },



//FOR COUPONS
createCoupon : async (req) => {
  const newCoupon = new Coupon(req.body);

  try {
    const savedCoupon = await newCoupon.save();
    return {
        status: true, code: 200, msg: "create coupon", data: savedCoupon,
      };
  } catch (err) {
    console.log(err);
  }
},


 getCoupon : async (req) => {
  try {
    const coupon = await Coupon.find({
code:req.params.code,
enabled:true,
    });
    return {
        status: true, code: 200, msg: "get coupon", data: coupon,
      };
  } catch (err) {
      res.json(err);
  }
},

getCoupons : async (req) => {
  try {
    const coupons = await Coupon.find();
    return {
        status: true, code: 200, msg: "get coupons", data: coupons,
      };
  } catch (err) {
      console.log(err);
  }
},

createOrder:(req)=>{
    try{
    var options = {
      amount: req.body.id*100*(1-(req.body.discount/100)),  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
        if(err) console.log(err);
      console.log(order);
      return {
        status: true, code: 200, msg: "order created", data: order,
      };

    });}
    catch(err){
    console.log(err);
    }
    },
verifyOrder: async (req)=>{
    try{
    

    let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'TWVoKnfd3izynbMibjJ2ipTT')
                                     .update(body.toString())
                                     .digest('hex');
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.razorpay_signature){
      response={"signatureIsValid":"true"}
      console.log("successful)");
     }
     const updatedUser= await userModel.findOneAndUpdate({ createdBy: req.user.userId },
        { $set: {isPaid:true,PlanId:req.body.plan_id} },
          { new: true });
          return {
            status: true, code: 200, msg: "payment verified", data: updatedUser,
          };
        }
        catch(err){
            console.log(err);
        }
     },

};
