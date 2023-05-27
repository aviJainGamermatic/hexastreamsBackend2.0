const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');

router.post('/signUp', userController.signUp);
router.post('/register', userController.register);
router.post('/verify', userController.verify);
router.post('/login', userController.login);
router.post('/update', userController.Update);



module.exports=router;
