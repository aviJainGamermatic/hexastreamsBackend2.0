const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');
const savelinkedAcc=require('../controller/linkedAcc')

router.post('/signUp', userController.signUp);
router.post('/register', userController.register);
router.post('/verify', userController.verify);
router.post('/login', userController.login);
router.post('/update', userController.Update);
router.post('/users/:userId/accounts',savelinkedAcc.save);


w
