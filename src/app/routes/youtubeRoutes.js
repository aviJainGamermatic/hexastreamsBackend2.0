
const express = require('express');
const router = new express.Router();
const youtubeController = require("../controller/Youtubecontroller");
const verify = require("../middleware/auth")



//creating authentication url
router.get('/generateUrl',youtubeController. signUpwithGoogle);

//redirect url
router.get("/auth/callback",youtubeController.redirectUri);

//generating strean key
router.get("/generateyoutubestreamkey",youtubeController.streamKey);

module.exports=router;
