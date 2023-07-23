const express = require('express');
const router = new express.Router();
const teamController = require("../controller/teamController");
const verify = require("../middleware/auth")


router.post('/create-team', verify, teamController.createTeam);
router.patch('/update-team', verify, teamController.updateTeam);
router.get('/get-all-teams',verify, teamController.listMyTeams);
router.get('/team-details', verify, teamController.getTeamDetailsById);
router.delete('/delete-team', verify, teamController.deleteTeam)
module.exports=router;