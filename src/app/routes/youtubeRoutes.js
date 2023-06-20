
const express = require('express');
const router = new express.Router();
const youtubeController = require("../controller/Youtubecontroller");
const verify = require("../middleware/auth")
 require("../middleware/passport-setup");
 const passport=require('passport');
const app=express();


router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

//creating authentication url
router.get('/generateUrl',youtubeController. signUpwithGoogle);

//to authenitcate google
router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/google' }), (req, res) => {
    // Redirect to the desired page after successful authentication
    res.redirect('/google-auth');
  });


  //updating user model
  router.get("/google-auth",youtubeController.googleauth);

//redirect url and creating linked account
router.get("/auth/callback2",youtubeController.redirectUri);


//lonking google account
//router.get("/googleaccounts",verify,youtubeController.googleaccounts);

//generating strean key
router.post("/generateyoutubestreamkey",youtubeController.streamKey);

module.exports=router;
