const axios =require ('axios');
const { TwitchAuth, TwitchAuthProvider } = require('twitch-auth');
const { ClientCredentialsAuthProvider, StaticAuthProvider, TwitchApi } = require('twitch');

const clientId = 'bwmhy0vuk1j3bad2tch7e19sgzjdw1';
const clientSecret = 'mj1z6abagj1l9atnwne0oq41bowzcu';
const redirectUri = 'http://localhost:8000/redirect';
 

//GENERATING STREAM KEY
async function generateStreamKey() {
  try {
    // Twitch API endpoint
    const apiUrl = 'https://api.twitch.tv/helix/streams/key';

    // Request headers
    const headers = {
      'Client-ID': 'bwmhy0vuk1j3bad2tch7e19sgzjdw1',
      'Authorization': 'Bearer token',
    };
     // Send POST request to generate stream key
     const response = await axios.post(apiUrl, null, { headers });

     const streamKey = response.data.data.stream_key;
     console.log('Stream key generated:', streamKey);
   } catch (error) {
     console.error('Error generating stream key:', error.response.data);
   }
 }

   
    module.exports={

        generatetwitchurl:async function(req){
            try{
            const responseType = 'code';
            const scope = 'channel:manage:broadcast';
    
            const Url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
          console.log(Url); 
          return {
            status: true, code: 200, msg: "twitch authentication url generated generated", data: Url,
          };
        }
        catch(err){
            console.log(err);
        }
        },



        generatetwitchtoken: async function(req){
            const code = req.query.code;
            console.log(code);
                   
            try {
              // Exchange the authorization code for a token
              if(!code) throw err;
              const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                  params: {
                      client_id: clientId,
                      client_secret: clientSecret,
                      code: code,
                      grant_type: 'authorization_code',
                      redirect_uri: redirectUri
                  }
                });
            
                let accessToken = response.data.access_token;
                let refreshToken = response.data.refresh_token;
            
                return {
                    status: true, code: 200, msg: "access token generated", data: accessToken,
                  };
           }  catch (error) {
              console.error('Error getting access token:', error);
            }
          },

          generatetwitchstreamkey:async function(req){
            let token=req.cookies['twitch_token']
                try {
                
                  const response = await axios.get(
                    `https://api.twitch.tv/helix/streams/key?broadcaster_id=${channelId}`,
                    null,
                    {
                      headers: {
                        'Client-ID': clientId,
                        'Authorization': `Bearer ${token}`
                      }
                    }
                  );
              
                  
                    const streamKey = response.data.data[0].stream_key;
                    return {
                        status: true, code: 200, msg: "stream key generated", data:streamKey,
                      };
                  
                } catch (error) {
                  console.error(error);
                }
            

          },





        };
        
    





