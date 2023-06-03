
const Plans = require("../models/Plans.js");
const Coupon = require("../models/Coupon.js");
const Razorpay= require ('razorpay');

//authenticating razorpay
var instance = new Razorpay({
    key_id: 'rzp_test_YqQ9om1jfcBSmS',
    key_secret: 'TWVoKnfd3izynbMibjJ2ipTT',
  });

module.exports={
 createPlan: async (req, res) => {
    const newPlan = new Plans(req.body);
  
    try {
      const savedPlan = await newPlan.save();
      res.status(200).json(savedPlan);
    } catch (err) {
      console.log(err);
    }
  },
  
  
   getPlan : async (req, res) => {
    try {
      const plan = await Plans.findById(req.params.id);
      res.status(200).json(plan);
    } catch (err) {
        console.log(err);
    }
  },

   getPlans : async (req, res) => {
    try {
      const plans = await Plans.find();
      res.status(200).json(plans);
    } catch (err) {
        console.log(err);
    }
  },



//FOR COUPONS
createCoupon = async (req, res) => {
  const newCoupon = new Coupon(req.body);

  try {
    const savedCoupon = await newCoupon.save();
    res.status(200).json(savedCoupon);
  } catch (err) {
    console.log(err);
  }
},


 getCoupon : async (req, res) => {
  try {
    const coupon = await Coupon.find({
code:req.params.code,
enabled:true,
    });
    res.status(200).json(coupon);
  } catch (err) {
      res.json(err);
  }
},

getCoupons : async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
      console.log(err);
  }
},

createOrder:(req,res)=>{
    // let price=req.body.id*100;let couponcode=req.body.couponcode;
    
    
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
    },
verifyOrder: (req,res)=>{
    

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
         res.send(response);
     },

};