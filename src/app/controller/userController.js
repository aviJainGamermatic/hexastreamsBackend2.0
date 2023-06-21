const { get } = require('mongoose');
const userService = require('../services/userService');

module.exports = {
  register: async function(req, res) {
    try {
      const result = await userService.register(req);
      if (result.status) return res.json({success: true, data: result});
      else return res.json({success: false, data: result});
    } catch (error) {
      return res.json({success: false, data: error});
    }
  },
  signUp: async function(req, res) {
    try {
      const result = await userService.signUp(req);
      return res.status(result.code).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        code: 500,
        msg: 'Internal server error',
      });
    }
  },
  verify: async function(req, res) {
    try {
      const result = await userService.verifyOtp(req);
      if (result.status) return res.json({success: true, msg: result.msg});
      else return res.json({success: false, msg: result.msg});
    } catch (error) {
      return res.json({success: false, data: error});
    }
  },
  login: async function(req, res) {
    try {
      const result = await userService.login(req);
      if (result.status) return res.json({success: true, data: result});
      else return res.json({success: false, data: result});
    } catch (error) {
      return res.json({success: false, data: error});
    }
  },
  Update: async function(req) {
      try {
        const result = await userService.updateUser(req);
        if (result.status) return res.json({success: true, data: result.data});
        else return res.json({success: false, data: result});
      } catch (error) {
        return res.json({success: false, data: error});
      }
  },
  getProfileData: async function(req){
    try {
      const getProfileData = await userService.getProfileData(req)
      if(getProfileData.status){
        return res.json({success: true, data: getProfileData.data});
      }else{
        return res.json({success: false, msg: "error"});
      }
    } catch (error) {
      return res.json({success: false, data: error});
    }
  }
};
