
const express = require('express');
const router = new express.Router();
const youtubeController = require("../controller/Youtubecontroller");
const verify = require("../middleware/auth")



//creating authentication url
router.get('/generateUrl',youtubeController. signUpwithGoogle);

//redirect url
router.get("/auth/callback",youtubeController.redirectUri);

//google aith
router.get("/google-auth",youtubeController.googleauth);

//lonking google account
router.get("/googleaccounts",verify,youtubeController.googleaccounts);

//generating strean key
router.get("/generateyoutubestreamkey",verify,youtubeController.streamKey);

module.exports=router;
