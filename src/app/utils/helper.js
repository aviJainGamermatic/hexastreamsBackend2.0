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
    },
     generateEmailContent: function(inviteeName, heading, paragraph, ctaText, ctaURL) {
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Join Hexastreams Gaming Team!</title>
            <style>
              /* Add your custom styles here */
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                text-align: center;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #ffffff;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
              }
              h1 {
                color: #FF5722;
              }
              p {
                color: #444;
                line-height: 1.6;
              }
              .cta-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #FF5722;
                color: #fff;
                text-decoration: none;
                border-radius: 30px;
                margin-top: 30px;
              }
              .cta-button:hover {
                background-color: #FF8A65;
              }
              .footer {
                margin-top: 40px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
               <img src="http://dev.hexastreams.com/icons/logoWithoutPlay.svg" alt="Hexastreams Gaming Logo">
              <h1>${heading}</h1>
              <p>Hey ${inviteeName}! 👋,</p>
              <p>${paragraph}</p>
             
              <a href="${ctaURL}" class="cta-button">${ctaText}</a>
              <p class="footer">Can't wait to have you onboard!<br>Best regards,<br>The Hexastreams Team</p>
            </div>
          </body>
          </html>
        `;
      }
      
      
}