const youtubeService = require('../services/youtubeServices.js');
const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');
const cookieParser = require('cookie-parser');


module.exports = {
    signUpwithGoogle: async function(req, res) {
      try {
        const url = await youtubeService.generateAuthUrl();
        
     return res.json({success: true, data: url});
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },

    redirectUri: async function(req, res) {
      try {
        let code=req.query.code;
        
        const result = await youtubeService.generatetoken(code);

        if(!req.cookies['jwt-token(google)'])
        res.redirect('/google-auth');
        else
        res.redirect('/googleaccounts');
       
        //return res.status(result.code).json(result);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: false,
          code: 500,
          msg: 'user not authorised',
        });
      }
    },
    googleauth: async function(req, res) {
        try {
          
          const result = await youtubeService.googleauth();
          let jwttoken=result.data;
          res.cookie('jwt-token(google)', jwttoken, {
              maxAge: 86400000, // Expiry time in milliseconds (e.g., 24 hours)
             // httpOnly: true, // Cookie is accessible only via HTTP(S), not JavaScript
          
          });
          return res.status(result.code).json(result);
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            status: false,
            code: 500,
            msg: 'user not authorised',
          });
        }
      },
      googleaccounts: async function(req, res) {
        try {
          console.log(5);
          const result = await youtubeService.googleaccounts(req);
          
          return res.status(result.code).json(result);
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            status: false,
            code: 500,
            msg: 'user not authorised',
            
          });
        }
      },
    streamKey: async function(req, res) {
      try {
        
        const cookieValue = req.cookies.acess_token;
  console.log(cookieValue);
        const result = await youtubeService.generateStreamkey(req);
         return res.json({success: true, msg: result.msg});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },
    
  };
  


