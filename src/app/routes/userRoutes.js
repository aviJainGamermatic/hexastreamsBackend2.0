const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');
const verify = require("../middleware/auth")

router.post('/signUp', userController.signUp);
router.post('/register', userController.register);
router.post('/verify', userController.verify);
router.post('/login', userController.login);
router.get("/getProfileData", verify,userController.getProfileData);
router.post("/update-profile", verify, userController.Update);
router.get("/get-users", userController.getAllUsers)



module.exports=router;
