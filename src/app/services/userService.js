const { generateOtp } = require("../utils/helper");

module.exports = {
  signUp: async function(req) {
    try {
      console.log('inside controllw');
      const {email} = req.body;
      const otp = generateOtp;
      
      return {status: true, data: otp};
    } catch (error) {
      console.log(error);
    }
  },
};
