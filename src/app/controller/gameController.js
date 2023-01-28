const gameService = require("../services/gameService");

module.exports = {
    createGame: async function(req, res){
        try {
            const result = await gameService.createStreamingEvent(req);
            if (result.status) return res.json({success: true, data: result});
            else return res.json({success: false, msg: result.msg});
          } catch (error) {
            return res.json({success: false, msd: error.message});
          }
    },
    listAllGames: async function(req, res){
        try {
            const result = await gameService.listAllGames(req);
            if (result.status) return res.json({success: true, data: result.data});
            else return res.json({success: false, msg: result.msg});
          } catch (error) {
            return res.json({success: false, msd: error.message});
          }
    },
    updateGame:async function(req,res){
        try {
            const result = await gameService.updateGame(req);
            if (result.status) return res.json({success: true, data: result.data});
            else return res.json({success: false, msg: result.msg});
          } catch (error) {
            return res.json({success: false, msd: error.message});
          }
    },
    deleteGame:async function(req,res){
        try {
            const result = await gameService.deleteGame(req);
            if (result.status) return res.json({success: true, data: result.msg});
            else return res.json({success: false, msg: result.msg});
          } catch (error) {
            return res.json({success: false, msd: error.message});
          }
    },
    myGamingEvents: async function(req,res){
        try {
            const result = await gameService.myGamingEvents(req);
            if (result.status) return res.json({success: true, data: result.data});
            else return res.json({success: false, msg: result.msg});
          } catch (error) {
            return res.json({success: false, msd: error.message});
          }
    }
}