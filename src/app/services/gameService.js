const gameModelSchema = require("../models/gameListModel");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  createStreamingEvent: async function (req) {
    try {
      const { title, thumbnailUrl, eventDate, eventTime, streamingPlatform } =
        req.body;
      const { userId, email } = req.user;
      console.log("req user", streamingPlatform);
      const userExist = await userModel.findOne({ _id: ObjectId(userId) });
      if (!userExist) {
        return {
          status: false,
          code: 404,
          msg: "You are not authorised to created event!",
        };
      }
      if (!title) {
        return { status: false, code: 404, msg: "Title is required!" };
      }
      if (!eventDate || !eventTime) {
        return {
          status: false,
          code: 404,
          msg: "Event date and time is required!",
        };
      }
      if (userExist) {
        const gameAdded = await gameModelSchema.create(req.body)
        console.log(gameAdded)
        // const gameAdded = await gameScheduled.save();
        return { status: true, code: 200, data: gameAdded };
      }
      //
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  listAllGames: async function (req) {
    try {
      const allGames = await gameModelSchema
        .find({})
        .populate("createdBy", "name userType email");
      return { status: true, code: 200, data: allGames };
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  updateGame: async function (req){
    try {
        const { title, thumbnailUrl, eventDate, eventTime, streamingPlatform, gameId } =
        req.body;
      const { userId, email } = req.user;
        let allGames = await gameModelSchema
          .findOne({_id:gameId})
        if(allGames){
          allGames.title =title; 
          allGames.thumbnailUrl=thumbnailUrl ?thumbnailUrl:allGames.thumbnailUrl ;
           allGames.eventDate = eventDate ?eventDate:allGames.eventDate ; 
           allGames.eventTime = eventTime ?eventTime :allGames.eventTime;
        allGames.streamingPlatform  = streamingPlatform ? streamingPlatform :allGames.streamingPlatform;
        const updated = await allGames.save()
        return { status: true, code: 200, data: updated };

        }
      } catch (error) {
        return { status: false, code: 500, msg: `${error.message}` };
      }
  },
  deleteGame: async function (req){
    try {
        const {gameId} = req.body;
        if(gameId){
            const deleteGame  = await gameModelSchema.findOneAndUpdate({_id:gameId},{isDeleted:true},{new:true})
            if(deleteGame){
                return {status: true, code: 200, msg: "Game Deleted" }
            }
        }else{
            return {status: false, code: 404, msg: "Game id not found!" }
        }
    } catch (error) {
        return {statu:false, code:500,msg:`${error.message}`}
    }

  },
  myGamingEvents: async function(req){
    try {
        const {userId} = req.user;
        if(userId){
            const myGames  = await gameModelSchema.find({createdBy:ObjectId(userId), isDeleted:false});
            if(myGames){
                return {status: true, code: 200, data: myGames}
            }else{
                return {status: false, code: 404, msg: "You have not created any games in platform"}
            }
        }
    } catch (error) {
        return {statu:false, code:500,msg:`${error.message}`}
    }
  }
};
