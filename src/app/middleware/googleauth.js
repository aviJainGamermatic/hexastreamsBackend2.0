


const googleverify = (req, res, next) => {
    const CLIENT_ID = "780976620194-ch6l1b0ss0aajl56p6i0n938mu6hq7jh.apps.googleusercontent.com";
    const CLIENT_SECRET =  "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";
    const REDIRECT_URI =  "http://localhost:3000/auth/callback";
    
    //Authenticationg Google API calls
    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    

  try {
    
    req.oAuth2Client = oAuth2Client;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verify;