const userService = require('../services/userService');

module.exports = {
  signUp: async function(req, res) {
    try {
      const result = await userService.signUp(req);
      if (result.status) return res.json({success: true, data: result});
      else return res.json({success: false, data: result});
    } catch (error) {
      return res.json({success: false, data: error});
    }
  },
};
