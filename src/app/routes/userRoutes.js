const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');

router.post('/signUp', userController.signUp);


module.exports=router;
