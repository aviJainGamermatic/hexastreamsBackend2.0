const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');
const cookieParser = require('cookie-parser');
const axios = require('axios');

// client-id, client secret and redirect uri
const CLIENT_ID = "780976620194-ch6l1b0ss0aajl56p6i0n938mu6hq7jh.apps.googleusercontent.com";
const CLIENT_SECRET =  "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";
const REDIRECT_URI =  "http://localhost:3000/auth/callback";

//Authenticationg Google API calls
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

module.exports={
    // GENERATE AUTH URL
    generateAuthUrl: async function(req){
        
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube'],
         });
          console.log(`Authorize this app by visiting this URL: ${url}`);
          return {
            status: true,
            code: 200,
            msg:  "url generated where user can choose google account",
            data: url,
           };
        
        
    },
     

    //GENERATING TOKEN AT REDIRECT URI
generatetoken: async function(req){
    const code=req.query.code;
    if(code){
        const {tokens} =  oAuth2Client.getToken(code,(err,tokens)=>{
            if(err) throw err;
            console.log({tokens});
        oAuth2Client.setCredentials(tokens);
         return {
            status: true,
            code: 200,
            msg: "User authorised",
            data:tokens,
          };
        });
}},

  //GENERATING STREAM KEY
    generateStreamkey:async function (req){
        const youtube = google.youtube({version: 'v3', auth: oAuth2Client});
        const res = await youtube.liveStreams.insert({
          part: ['snippet,cdn'],
          requestBody: {
            snippet: {
              title: 'My Test Stream',
              description: 'A test stream created with the YouTube API',   
            },
            cdn: {
                frameRate: '30fps',
                ingestionType: 'rtmp',
                resolution: '1080p',
            }, }, });
        let streamKey = res.data.cdn.ingestionInfo.streamName;
    console.log(`Stream key: ${streamKey}`);
     let rtmpUrl = res.data.cdn.ingestionInfo.ingestionAddress;
    return {
        status: true, code: 200, msg: "stream key generated", data: streamKey,
      };
      },
     

      getAccessTokenFromRefreshToken: async function(refreshToken) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: refreshToken,
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
      grant_type: 'refresh_token',
    });

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;


    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
}


};