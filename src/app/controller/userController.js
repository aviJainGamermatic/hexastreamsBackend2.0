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
      const { userId, email, phoneNumber, organization, userType, name, password } = req.body;
  
      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        return {
          status: false,
          code: 404,
          msg: 'User not found',
        };
      }
  
      // existingUser.email = email || existingUser.email;
      existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
      // existingUser.organization = organization || existingUser.organization;
      // existingUser.userType = userType || existingUser.userType;
      // existingUser.password = password || existingUser.password;
      existingUser.name = name || existingUser.name
  
      await existingUser.save();
  
      return {
        status: true,
        code: 200,
        msg: 'User information updated successfully',
        data: existingUser,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        code: 500,
        msg: 'Internal server error',
      };
    }
  },
  getProfileData: async function(req){
    try {
      const getProfileData = await userService.getProfileData(req)
    } catch (error) {
      return res.json({success: false, data: error});
    }
  }
};
