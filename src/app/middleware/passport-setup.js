const passport=require ('passport');
const GoogleStrategy= require('passport-google-oauth2');
const CLIENT_ID = "780976620194-ch6l1b0ss0aajl56p6i0n938mu6hq7jh.apps.googleusercontent.com";
const CLIENT_SECRET =  "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";
const REDIRECT_URI =  "http://localhost:3000/auth/callback";

const CLIENTID2="922374006387-f05rs4b4inngmfm2mv66kce9t608ldj4.apps.googleusercontent.com";
const CLIENTSECRET2="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";
const REDIRECT_URI2 =  "http://localhost:3000/auth/callback2";

passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(user,done){
    done(null,user);
});

passport.use(new GoogleStrategy({
    clientID:CLIENTID2,
    clientSecret:CLIENTSECRET2,
    callbackURL:REDIRECT_URI2,
    passReqToCallback:true,
},function(request,accessToken,refreshToken,profile,done){
    console.log(profile);
    return done(null,profile);
}
));
