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
      if (result.status) return res.json({success: true, data: result});
      else return res.json({success: false, data: result});
    } catch (error) {
      return res.json({success: false, data: error});
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
};
