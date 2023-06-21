const {google} = require('googleapis');
const {OAuth2Client} = require('google-auth-library');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const liveStreamModel = require("../models/liveStreamModel");
const accountModel=require("../models/Accounts");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const passport =require ("passport");
//const passport-setup = require("../middleware/passport-setup");

// client-id, client secret and redirect uri
const CLIENT_ID = "780976620194-ch6l1b0ss0aajl56p6i0n938mu6hq7jh.apps.googleusercontent.com";
const CLIENT_SECRET =  "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";
const REDIRECT_URI =  "http://localhost:3000/auth/callback";

//Authenticationg Google API calls
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

module.exports={
   
    // GENERATE AUTH URL
    generateAuthUrl: async function(req){
        try{
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/userinfo.email' , 'https://www.googleapis.com/auth/userinfo.profile'],
         });
          console.log(`Authorize this app by visiting this URL: ${url}`);
          return {
            status: true,
            code: 200,
            msg:  "url generated where user can choose google account",
            data: url,
           };}
           catch(err){
            console.log(err)
           }
        
        
    },
     

    //GENERATING TOKEN AT REDIRECT URI
generatetoken: async function(req){
    try{
    let code=req.query.code;
        const {tokens} = await oAuth2Client.getToken(code); 
        let accessToken=tokens.access_token;     
            console.log({tokens});
        oAuth2Client.setCredentials(tokens);

        const people = google.people({ version: 'v1', auth: oAuth2Client });
        const res = await people.people.get({
          resourceName: 'people/me',
          personFields: 'names,emailAddresses',
        });

        let email=res.data.emailAddresses[0].value;
       let id=null;
        const linkedaccount = await accountModel.findOne({ authID: email });
        if (linkedaccount) {
            console.log("account already exists");
              const updatedLinkedAccount= await accountModel.findOneAndUpdate({ authID: email },
           { $set: {
                token:accessToken
            } },
              { new: true });
              id=updatedLinkedAccount._id;
              console.log(updatedLinkedAccount);
          }
          else{
             const newAccount = new accountModel({
                //userId:req.user.userId,
                type:"youtube",
                authID:email,
                token:accessToken,
              });
             let updatedLinkedAccount= await newAccount.save();
             id=updatedLinkedAccount._id;
            }
    
             // console.log(updatedLinkedAccount);
              return {
                status: true, code: 200, msg: "google account ;linked", data:{
                    email:email,
                    token:accessToken,
                    id:id,
                }
              };




       //  return {
         //   status: true,
           // code: 200,
            //msg: "User authorised",
            //data:accessToken,
          //};

}
catch(err){
    console.log(err);
}
},


//GOOGLE AUTH
googleauth: async function(req){
    try{
    

        //getting personal info
       // const people = google.people({ version: 'v1', auth: oAuth2Client });
        //const res = await people.people.get({
          //resourceName: 'people/me',
          //personFields: 'names,emailAddresses',
        //});
        
        let jwttoken=null;
        const name = req.user.displayName
        const email = req.user.emails[0].value;
       // const email = res.data.emailAddresses[0].value;
        
        // Do something with the name and email
        console.log('Name:', name);
        console.log('Email:', email);
        const user = await userModel.findOne({ email: email });
        console.log("------------------------------", user);
        if (user) {
          console.log("user already exists");
           jwttoken = jwt.sign(
            { userId: user._id, email: user.email },
            "secretKey"
          );
          // console.log(jwttoken);
        } else {
            const newUser = new userModel({
                name:name,
                email:email,
              });
              await newUser.save();

        }
         return {
            status: true,
            code: 200,
            msg: "User authorised",
            data:jwttoken,
          };

}
catch(err){
    console.log(err);
}
},
googleaccounts:async function(req){
    try{
    
        console.log(req.user.userId);
    //const updatedlinkedaccount= await accountModel.findOneAndUpdate({ createdBy: req.user.userId },
      //  { $set: {
        //    type:"youtube"
       // } },
         // { new: true });
         const newAccount = new accountModel({
            userId:req.user.userId,
            type:"youtube",
          });
         let updatedLinkedAccount= await newAccount.save();

          console.log(updatedLinkedAccount);
          return {
            status: true, code: 200, msg: "google account ;linked", data:updatedLinkedAccount
          };

    }
    catch(err){
        console.log(err);
    }
},

  //GENERATING STREAM KEY
    generateStreamkey:async function (req){
        let id=req.id;
       let name=req.name;
        try{
          const updatedLinkedAccount= await accountModel.findOneAndUpdate({ authID: email },
                { $set: {
                     title:name,
                 } },
                   { new: true });
                   
                   console.log(updatedLinkedAccount);
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

     // updating stream key
     const liveStream = await liveStreamModel.findOne({ linkedaccount:id, });
     if (liveStream) {
         console.log("account already exists");
           const updatedLinkedAccount= await liveStreamModel.findOneAndUpdate({ linkedaccount:id, },
        { $set: {
            streamKey:streamKey
         } },
           { new: true });
           
           console.log(updatedLinkedAccount);
       }
       else{
        const newLiveStream = new liveStreamModel({
            linkedaccount:id,
            streamKey:streamKey
          });
         let updatedLiveStream= await newLiveStream.save();
         console.log(updatedLiveStream);
         }
     
     

  
   
return {
        status: true, code: 200, msg: "stream key generated", data: streamKey,
      };}
      catch(err){
        console.log(err);
      }
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
