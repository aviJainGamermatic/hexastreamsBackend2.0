const { application } = require('express');
const express = require('express');
const router = new express.Router();
const razorpayController = require("../controller/Razorpaymodelcontroller");
const verify = require("../middleware/auth")


//CREATE PLAN
router.post("/plans", razorpayController.createPlan);
//GET PLAN
router.get("/plans/find/:id", razorpayController.getPlan);
//GET ALL PLANS
router.get("/plans/all",verify, razorpayController.getPlans);


//CREATE COUPONS
router.post("/coupons", razorpayController.createCoupon);
//GET COUPON
router.get("/coupons/find/:code",verify, razorpayController.getCoupon);
//GET ALL COUPONS
router.get("/coupons/all", razorpayController.getCoupons);

//creating order id
router.post('/create/orderId',verify,razorpayController.createOrder);

//verifying order
router.post("/api/payment/verify",verify,razorpayController.verifyOrder);

module.exports=router;
