
const Plans = require("../models/Plans.js");
const Coupon = require("../models/Coupon.js");
const Razorpay= require ('razorpay');
const razorpayService = require('../services/razorpayServices');
const { AsyncLocalStorage } = require("async_hooks");


module.exports={
 createPlan: async (req, res) => {
    try {
        const result = await razorpayService.createPlan(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },
  
  
   getPlan : async (req, res) => {
    try {
        const result = await razorpayService.getPlan(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
  },

   getPlans : async (req, res) => {
    try {
        const result = await razorpayService.getPlans(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
  },



//FOR COUPONS
createCoupon : async (req, res) => {
    try {
        const result = await razorpayService.createCoupon(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
},


 getCoupon : async (req, res) => {
    try {
        const result = await razorpayService.getCoupon(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
},

getCoupons : async function(req, res)  {
    try {
        const result = await razorpayService.getCoupons(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
},

createOrder:async function(req,res){
    
    try {
      var options = {
            amount: req.body.id*100*(1-(req.body.discount/100)),  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options, function(err, order) {
              if(err) console.log(err);
            console.log(order);
            return res.send({data:order});
          });
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },
verifyOrder:async function (req,res){
    
    try {
        const result = await razorpayService.verifyOrder(req);
         return res.json({success: true, msg: result.msg,data:result.data});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
    
     },

};
