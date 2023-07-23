const teamService = require('../services/teamService');
module.exports = {
    createTeam:  async function(req, res) {
        try {
          const data = await teamService.createTeam(req);
          if(data.status){
            return res.json({success: true, data: data});
          }
          return res.json({success:false, msg:data.msg})
       
        } catch (error) {
          return res.json({success: false, msg: error});
        }
      },
      updateTeam:  async function(req, res) {
        try {
          const data = await teamService.updateTeam(req);
          if(data.status){
            return res.json({success: true, data: data});
          }
          return res.json({success:false, msg:data.msg})
       
        } catch (error) {
          return res.json({success: false, msg: error});
        }
      },
      getTeamDetailsById:  async function(req, res) {
        try {
          const data = await teamService.getTeamDetailsById(req);
          if(data.status){
            return res.json({success: true, data: data});
          }
          return res.json({success:false, msg:data.msg})
       
        } catch (error) {
          return res.json({success: false, msg: error});
        }
      },
      listMyTeams:  async function(req, res) {
        try {
          const data = await teamService.listMyTeams(req)
          if(data.status){
            return res.json({success: true, data: data});
          }
          return res.json({success:false, msg:data.msg})
       
        } catch (error) {
          return res.json({success: false, msg: error});
        }
      },
      deleteTeam:  async function(req, res) {
        try {
          const data = await teamService.deleteTeam(req)
          if(data.status){
            return res.json({success: true, data: data});
          }
          return res.json({success:false, msg:data.msg})
       
        } catch (error) {
          return res.json({success: false, msg: error});
        }
      },
      

}