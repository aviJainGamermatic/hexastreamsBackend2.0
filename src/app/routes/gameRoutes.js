const express = require('express');
const router = new express.Router();
const gameController = require("../controller/gameController");
const verify = require("../middleware/auth")

router.post("/create-event", verify, gameController.createGame);
router.put("/update-event", verify,gameController.updateGame);
router.delete("/delete-event", verify, gameController.deleteGame);
router.get("/list",verify, gameController.listAllGames);
router.get("/my-events", verify, gameController.myGamingEvents);


module.exports=router;