const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Account = require('../models/account');

module.exports={
  save: async function (req, res){
    try {
      const { userId } = req.params; 
      const { type, authID, token, title } = req.body; 
  
   
      const account = new Account({ type, authID, token, title });
  
      
      await account.save();
  
      
      const user = await User.findById(userId);
  
      user.linkedAccounts.push(account);
      await user.save();
  
      res.status(201).json({ message: 'Account linked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
};