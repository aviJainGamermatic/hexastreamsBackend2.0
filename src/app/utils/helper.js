const otpGenerator = require('otp-generator');

module.exports ={
    generateOtp : function (){
        console.log('insert all generate otp');
        const otps = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false, specialChars: false
        });

        console.log('otps',otps);
        return otps
    }
}