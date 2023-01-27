const otpGenerator = require('otp-generator');

module.exports ={
    generateOtp : function (){
        const otp = otpGenerator.generate(6, {digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false, specialChars: false});
        return otp
    }
}