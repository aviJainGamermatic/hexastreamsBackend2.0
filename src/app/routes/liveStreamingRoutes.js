const express = require('express');
const router = new express.Router();
const liveStreamingController = require("../controller/liveStreamingController");
const verify = require("../middleware/auth")

router.get("/verify",verify, liveStreamingController.verify);
router.post("/create-room", verify, liveStreamingController.createRoom);
router.delete("/delete-room", verify, liveStreamingController.deleteRoom);
router.get("/create-livestream", verify, liveStreamingController.createLiveStream);
router.post("/go-live-youtube",verify, liveStreamingController.liveStreamInYoutube);
router.post("/go-live-facebook", verify, liveStreamingController.liveStreamInFacebook);
router.post("/go-live-twitch",verify, liveStreamingController.liveStreamInTwitch);
router.post("/stop-live-streaming",verify, liveStreamingController.stopLiveStreaming);
router.get("/live-stream-details",verify, liveStreamingController.getLiveStreamingInfoByStreamingId);
router.get("/live-stream-list-byUser", verify, liveStreamingController.getLiveStreaminListByUserId);
router.get("/mark-live-stream-complete", verify, liveStreamingController.markLiveStreamComplete)
module.exports=router;