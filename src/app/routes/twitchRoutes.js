const express = require('express');
const router = new express.Router();
const twitchController = require("../controller/twitchController");
const verify = require("../middleware/auth")



//creating authentication url
router.get('/generateTwitchUrl',twitchController.generatetwitchurl);

//redirect url
router.get("/redirect",twitchController.generatetwitchtoken);

//generating strean key
router.get("/generatetwitchstreamkey",verify,twitchController.generatestreamkey);

module.exports=router;
