const passport=require ('passport');
const GoogleStrategy= require('passport-google-oauth2');
const CLIENT_ID = "780976620194-ch6l1b0ss0aajl56p6i0n938mu6hq7jh.apps.googleusercontent.com";
const CLIENT_SECRET =  "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";
const REDIRECT_URI =  "http://localhost:3000/auth/callback";

passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(user,done){
    done(null,user);
});

passport.use(new GoogleStrategy({
    clientID:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    callbackURL:REDIRECT_URI,
    passReqToCallback:true,
},function(request,accessToken,refreshToken,profile,done){
    console.log(profile);
    return done(null,profile);
}
));
