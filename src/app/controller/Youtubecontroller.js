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
        const result = await youtubeService.generatetoken(req);
        const tokens=result.data;
        res.cookie('access_token', tokens.access_token, {
            maxAge: 86400000, // Expiry time in milliseconds (e.g., 24 hours)
            httpOnly: true, // Cookie is accessible only via HTTP(S), not JavaScript
        
          });
        
          
        
        return res.status(result.code).json(result);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          code: 500,
          msg: 'user not authorised',
        });
      }
    },
    streamKey: async function(req, res) {
      try {
        const result = await youtubeService.generateStreamkey(req);
         return res.json({success: true, msg: result.msg});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },
    
  };
  


