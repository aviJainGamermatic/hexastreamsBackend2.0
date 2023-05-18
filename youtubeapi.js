const express= require ('express');
const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');
const ffmpeg = require('fluent-ffmpeg');
const axios =require ('axios');
const OAuth2Data=require('./credentials.json');
const dotenv=require ("dotenv");

const { appengine } = require('googleapis/build/src/apis/appengine');
dotenv.config();

// client-id, client secret and redirect uri
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET =  OAuth2Data.web.client_secret;
const REDIRECT_URI =  OAuth2Data.web.redirect_uris[0];

const app=express();

//Authenticationg Google API calls
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set your Mux API credentials

const muxAccessToken = "f07d6c35-08b5-4d45-927e-73f5627edf96";
const muxSecretKey = "ppZb5gvjLXSDQUX+XMBypMhY5CrQ3LRhdnEKRyEtDkPoE5+5Z0EVPB0iSb/iYdVxKf9JW9VjZcl";
const username = muxAccessToken;
const password = muxSecretKey;

// Create a base64-encoded authentication token
const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

// Define the login API endpoint
const loginUrl = 'https://api.mux.com/login';

// Make a POST request to the login API
axios.post(loginUrl, {}, {
  headers: {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    // Login successful
    console.log('Login successful');
    console.log('Access token:', response.data.token);
  })
  .catch(error => {
    // Login failed
    console.error('Login failed:', error.message);
  });


  //creating mux live stream
let muxLiveStreamId;
 
  async function createMuxLiveStream() {
    try {
      // Create a live stream
      const createResponse = await axios.post(
        'https://api.mux.com/video/v1/live-streams',
        {},
        {
          auth: {
            username: process.env.muxAccessToken,
            password: process.env.muxSecretKey
          }
        }
      );
      
  
      // Generate stream key and RTMP URL
      const { data } = response.data;
      muxLiveStreamId=data.id;
    const streamKeymux= data.stream_key;
    const rtmpUrl = `rtmp://global-live.mux.com:5222/app/${streamKey}`;

    console.log('RTMP URL:', rtmpUrl);
    console.log(streamKeymux)

    return {rtmpUrl,streamKeymux};
    
    
    }
      catch(err) {console.log(err);}
      
    }



// Define the live simulcast API endpoint


// Define the simulcast target data for YouTube and Twitch
let streamKey;let rtmpUrl;

// Function to send the simulcast request to Mux
async function sendSimulcastRequest() {
  try {
    let simulcastEndpoint = `https://api.mux.com/video/v1/live-streams/${muxLiveStreamId}/simulcast-targets`;
    let simulcastTargets = [
        {
          name: 'YouTube',
          provider: 'youtube',
          stream_key: streamKey,
        }
      ];
      
    const response = await axios.post(simulcastEndpoint, simulcastTargets, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${muxAccessToken}`,
        'mux-signature': muxSecretKey,
      },
    });
    console.log('Simulcast targets added:', response.data);
  } catch (error) {
    console.error('Error adding simulcast targets:', error);
  }
}

  

// Authorize the application
async function authorize() {
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube'],
   });
    console.log(`Authorize this app by visiting this URL: ${url}`);
    const code = 'YOUR_AUTHORIZATION_CODE';
    
  }
  authorize();

  //inserting live stream
let streamId; 
  async function createStream() {
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
        },
      },
    });
    streamId=res.data.id;
    console.log('Stream created:', res.data.id);
    console.log(`Live stream URL: https://www.youtube.com/watch?v=${res.data.id}`);
     streamKey = res.data.cdn.ingestionInfo.streamName;
console.log(`Stream key: ${streamKey}`);
 rtmpUrl = res.data.cdn.ingestionInfo.ingestionAddress;
console.log('RTMP URL:', rtmpUrl);
    return res.data;
  }


  //generating channel id
  let ChannelID;
  async function generateChannelId(){
  const youtube = google.youtube({
    version: 'v3',
    auth: oAuth2Client
  });
  
  // Call the channels.list method to retrieve channel information
  youtube.channels.list({
    part: 'snippet',
    mine: true
  }, (err, res) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
     ChannelID=res.data.items[0].id;
    console.log('Channel ID:', res.data.items[0].id);
  });
  return ChannelID;
  }

  //inserting and binding live broadcast
  let liveBroadcastID;
  async function bindLiveStream(auth, liveStreamId, channelId) {
    const youtube = google.youtube({ version: 'v3', auth });
    const res = await youtube.liveBroadcasts.insert({
        part: 'id,snippet,status',
        requestBody: {
            snippet: {
                title: 'My Live Broadcast',
                description: 'My first live broadcast',
                scheduledStartTime: new Date().toISOString(),
                scheduledEndTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                channelId: channelId,
                liveStreamId: liveStreamId,
            },
            status: {
                privacyStatus: 'public',
            },
        },
    });
    liveBroadcastID=res.data.id;
    console.log(`Live broadcast URL: https://www.youtube.com/watch?v=${res.data.id}`);
    return res.data;
}

// Bind the live stream to a broadcast
const bindBroadcastStream = async (broadcastId, streamId) => {
    const youtube = google.youtube({ version: 'v3', oAuth2Client });
    const res =  youtube.liveBroadcasts.bind({
        auth: oAuth2Client,
        part: 'id,snippet,status',
        id: broadcastId,
        streamId: streamId,
      }, (err, res) => {
        if (err) {
          console.error('Error binding live broadcast:');
          return;
        }
      
        console.log('Live broadcast bound to live stream:');
    });
    
  }

  //starting live stream
  const startStream=async(broadcastId,streamId)=>{
    const youtube = google.youtube({ version: 'v3', oAuth2Client });
    youtube.liveStreams.transition({
        auth: oAuth2Client,
        part: 'id,snippet,status',
        id: streamId,
        body: {
          status: 'live'
        }
      }, (err, res) => {
        if (err) {
          console.error('Error starting live stream:', err);
          return;
        }
    
        console.log('Live stream started:', res.data);
      }
      );
    };
  









// Start the live stream
async function startStreaming(broadcastId){
    const youtube = google.youtube({
        version: 'v3',
        auth: oAuth2Client
      });
const startStream = await youtube.liveBroadcasts.transition({
  auth: oAuth2Client,
  broadcastStatus: 'live',
  id: broadcastId,
  part: 'id,status'
});

console.log(`Stream started. Watch it at https://www.youtube.com/watch?v=${broadcastId}`);
return startStream;
}

//start streaming to the stream url
// Start streaming video to the live stream
async function startStreaming2(stream) {
    const rtmpUrl = stream.cdn.ingestionInfo.ingestionAddress + '/' + stream.cdn.ingestionInfo.streamName;
    const ffmpegCmd = ffmpeg()
      .input('YOUR_VIDEO_FILE')
      .inputOptions(['-re'])
      .videoCodec('copy')
      .audioCodec('aac')
      .outputOptions(['-f flv', '-vcodec h264', '-acodec aac', '-strict -2', '-flags +global_header', '-bsf:a aac_adtstoasc'])
      .output(rtmpUrl)
      .on('start', function(commandLine) {
        console.log('Started streaming:', commandLine);
      })
      .on('end', function() {
        console.log('Finished streaming');
      })
      .on('error', function(err) {
        console.error('Error:', err.message);
      });
    ffmpegCmd.run();
  }
  










  
app.get('/auth/callback',async(req,res)=>{
    const code=req.query.code;
    if(code){
        const {tokens} = await oAuth2Client.getToken(code);
        console.log({tokens});
        oAuth2Client.setCredentials(tokens);
        console.log('Authorized');
       await generateChannelId();
        console.log("channelid generated");
        await createStream();
        console.log("stream created");
        await bindLiveStream(oAuth2Client,streamId,ChannelID);
        console.log("broadcast created");
        await bindBroadcastStream(liveBroadcastID,streamId);
       //await createMuxLiveStream();
       console.log("mux stream created");
       await sendSimulcastRequest();

    }

})





app.listen(3000,(req,res)=>{
    console.log("kistening on port 3000");
});



    