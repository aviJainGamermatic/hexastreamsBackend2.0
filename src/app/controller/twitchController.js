const twitchService = require('../services/twitchServices.js');
const cookieParser = require('cookie-parser');


module.exports = {
    generatetwitchurl: async function(req, res) {
      try {
        const url = await twitchService.generatetwitchurl();
        
     return res.json({success: true, data: url});
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },

    generatetwitchtoken: async function(req, res) {
      try {
        const result = await twitchService.generatetwitchtoken(req);
        const token=result.data;
        res.cookie('twitch_token', token, {
            maxAge: 86400000, // Expiry time in milliseconds (e.g., 24 hours)
           // httpOnly: true, // Cookie is accessible only via HTTP(S), not JavaScript
        
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
    generatestreamkey: async function(req, res) {
      try {
        const result = await twitchService.generatestreamkey(req);
         return res.json({success: true, msg: result.msg});
        
      } catch (error) {
        return res.json({success: false, data: error});
      }
    },
    
  };
  


