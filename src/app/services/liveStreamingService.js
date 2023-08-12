const { default: axios } = require("axios");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const { findOne } = require("../models/liveStreamModel");
const liveStreamModel = require("../models/liveStreamModel");
const socialMediaStreamingModel = require("../models/socialMediaStreamingModel");
const { config } = require("dotenv");
const { errorMonitor } = require("nodemailer/lib/xoauth2");

module.exports = {
  verify: async function (req) {
    try {
      const rooms = await axios({
        method: "get", //you can set what request you want to be
        url: "https://api.daily.co/v1/rooms",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API}`,
        },
      });
      return { status: rooms.data.status, data: rooms.data.data };
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  createRoom: async function (req) {
    try {
      const expiryDate = moment().unix();
      const expiredAfter5Min = expiryDate + 5 * 60;

      const newRoom = await axios({
        method: "post",
        url: "https://api.daily.co/v1/rooms",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API}`,
        },
        data: {
          properties: {
            exp: expiredAfter5Min,
            enable_screenshare: true,
            enable_people_ui: true,
          },
        },
      });
      return { status: newRoom.data.status, data: newRoom.data.data };
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  deleteRooms: async function (req) {
    try {
      const roomName = req.query.roomName;
      const rooms = await axios({
        method: "delete", //you can set what request you want to be
        url: `https://api.daily.co/v1/rooms/${roomName}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API}`,
        },
      });
      console.log("-------", rooms.data);
      if (rooms.data.deleted === true) {
        return { status: true, data: "Deleted" };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  createLiveStream: async function (req) {
    console.log('inside create live stream', req.body);
    const streamType = req.body.streamType ? req.body.streamType  : "individual";
    if(streamType == "team"){
      if(req.body.teamId == "" || req.body.teamId == undefined || req.body.teamId == null  ){
        return { status: false, code: 400, msg: `Select a team to stream the video!` }; 
      }
    }
    try {
      console.log('ccc xxxx ccxx');
      let config = {
        method: "POST",
        url: `${process.env.ANT_MEDIA_URL}broadcasts/create`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.ANT_MEDIA_AUTH}`
        },
        data: req.body,
      };
      const muxData = await axios(config);
      if (muxData.status == 200) {
        const saveMuxData = await liveStreamModel.create({
          streamKey: muxData.data.streamId,
          createdBy: req.user.userId,
          status: muxData.data.status,
          muxStreamingId: "",
          startTime: "",
          playbackId: "",
          streamType: streamType,
          teamId: req.body.teamId ? ObjectId(req.body.teamId) : null
        });

        return { status: true, data: saveMuxData, antMediaData:muxData.data  };
      }
    } catch (error) {
      console.log(error.response.data)
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  restreamToYoutube : async function (req)  {
    try {
      const { liveStreamId, youtube } = req.body;
      const livestreamData = await liveStreamModel.findOne({ streamKey: liveStreamId });
      
      console.log('livestreamData', livestreamData);
      
      if (livestreamData) {
        const configForAnt = {
          method: "POST",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}/rtmp-endpoint`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.ANT_MEDIA_AUTH,
          },
          data: {
            rtmpUrl: youtube.url,
          },
        };
        
        const streamData = await axios(configForAnt);
        console.log('liveStream data youtube', streamData.data);
        
        if (streamData.data.success) {
          const simulcastData = await socialMediaStreamingModel.create({
            liveStreamModelId: livestreamData._id,
            platformName: "youtube",
            muxSimulcastId: "",
            url: youtube.url,
            streamKey: youtube.streamKey,
            status: "",
            passthrough: youtube && youtube.passthrough ?  youtube.passthrough : '',
            createdBy: req.user.userId,
          });
          
          console.log('simulcastData saved', simulcastData);
          
          livestreamData.socialMediaIds.push(simulcastData._id);
          await livestreamData.save();
          
          const findWithPopulatedLiveStreamData = await liveStreamModel
            .findOne({ streamKey: liveStreamId })
            .populate("socialMediaIds");
          
          console.log("findWithPopulatedLiveStreamData", findWithPopulatedLiveStreamData);
          
          return { status: true, data: findWithPopulatedLiveStreamData };
        } else {
          return {
            status: false,
            msg: streamData.data.message,
          };
        }
      }
    } catch (error) {
      return { status: false, code: 500, msg: error.message };
    }
  },

  restreamToTwitch : async function(req) {
    try {
      const { liveStreamId, twitch } = req.body;
      const livestreamData = await liveStreamModel.findOne({ streamKey: liveStreamId });
      
      if (livestreamData) {
        const configForAnt = {
          method: "POST",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}/rtmp-endpoint`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.ANT_MEDIA_AUTH,
          },
          data: {
            rtmpUrl: twitch.url,
          },
        };
        
        const streamData = await axios(configForAnt);
        
        if (streamData.data.success) {
          const simulcastData = await socialMediaStreamingModel.create({
            liveStreamModelId: livestreamData._id,
            platformName: "twitch",
            muxSimulcastId: "",
            url: twitch.url,
            streamKey: twitch.streamKey,
            status: "",
            passthrough: twitch && twitch.passthrough ?  twitch.passthrough : '',
            createdBy: req.user.userId,
          });
          
          console.log('simulcastData saved', simulcastData);
          
          livestreamData.socialMediaIds.push(simulcastData._id);
          await livestreamData.save();
          
          const findWithPopulatedLiveStreamData = await liveStreamModel
            .findOne({ streamKey: liveStreamId })
            .populate("socialMediaIds");
          
          console.log("findWithPopulatedLiveStreamData", findWithPopulatedLiveStreamData);
          
          return { status: true, data: findWithPopulatedLiveStreamData };
        } else {
          return {
            status: false,
            msg: streamData.data.message,
          };
        }
      }
    } catch (error) {
      return { status: false, code: 500, msg: error.message };
    }
  },
  restreamToFacebook : async function(req) {
    try {
      const { liveStreamId, facebook } = req.body;
      const livestreamData = await liveStreamModel.findOne({ streamKey: liveStreamId });
      
      if (livestreamData) {
        const configForAnt = {
          method: "POST",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}/rtmp-endpoint`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.ANT_MEDIA_AUTH,
          },
          data: {
            rtmpUrl: facebook.url,
          },
        };
        
        const streamData = await axios(configForAnt);
        
        if (streamData.data.success) {
          const simulcastData = await socialMediaStreamingModel.create({
            liveStreamModelId: livestreamData._id,
            platformName: "facebook",
            muxSimulcastId: "",
            url: facebook.url,
            streamKey: facebook.streamKey,
            status: "",
            passthrough: facebook && facebook.passthrough ?  facebook.passthrough : '',
            createdBy: req.user.userId,
          });
          
          console.log('simulcastData saved', simulcastData);
          
          livestreamData.socialMediaIds.push(simulcastData._id);
          await livestreamData.save();
          
          const findWithPopulatedLiveStreamData = await liveStreamModel
            .findOne({ streamKey: liveStreamId })
            .populate("socialMediaIds");
          
          console.log("findWithPopulatedLiveStreamData", findWithPopulatedLiveStreamData);
          
          return { status: true, data: findWithPopulatedLiveStreamData };
        } else {
          return {
            status: false,
            msg: streamData.data.message,
          };
        }
      } 
    } catch (error) {
      return { status: false, code: 500, msg: error.message };
    }
  },
  pauseLiveStreaming : async function (req){
    try {
      const liveStreamKey = req.body.liveStreamId;
      const findDataSavedInDb = await liveStreamModel.findOne({ streamKey: liveStreamKey });
  
      if (findDataSavedInDb) {
        // Pause the streaming
        const configForAnt = {
          method: "POST",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamKey}/stop`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.ANT_MEDIA_AUTH,
          }
        };
  
        const stopStreamResponse = await axios(configForAnt);
        console.log('stop stream response', stopStreamResponse.data);

        if (stopStreamResponse.data.success) {
          findDataSavedInDb.status = "pause";
          const updatedData = await findDataSavedInDb.save();
          return { status: true, code: 200, msg: 'Successfully stopped streaming', data: updatedData };
        } else {
          return { status: false, code: 500, msg: "Error encountered while stopping stream" };
        }
      } else {
        return { status: false, code: 404, msg: "Couldn't fetch live stream data!" };
      }
    } catch (error) {
      return { status: false, code: 500, msg: error.message };
    }
  },
    
  playLiveStreaming : async function (req){
    try {
      const liveStreamKey = req.body.liveStreamId;
      const findDataSavedInDb = await liveStreamModel.findOne({ streamKey: liveStreamKey });
  
      if (findDataSavedInDb) {
        // Pause the streaming
        const configForAnt = {
          method: "POST",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamKey}/start`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.ANT_MEDIA_AUTH,
          }
        };
  
        const startStreamResponse = await axios(configForAnt);
        console.log('start stream response', startStreamResponse.data);
        if (startStreamResponse.data.success) {
          findDataSavedInDb.status = "playing";
          const updatedData = await findDataSavedInDb.save();
          return { status: true, code: 200, msg: 'Successfully stopped streaming', data: updatedData };
        } else {
          return { status: false, code: 500, msg: "Error encountered while stopping stream" };
        }
      } else {
        return { status: false, code: 404, msg: "Couldn't fetch live stream data!" };
      }
    } catch (error) {
      return { status: false, code: 500, msg: error.message };
    }
  },
  stopAndDeleteLiveStreaming :async function (req){
    try {
      console.log('Inside live streaming');
      const liveStreamId = req.body.liveStreamId;
      const liveStreamingDataWithSimulcast = await liveStreamModel
        .findOne({ streamKey: liveStreamId })
        .populate('socialMediaIds');
  
      if (liveStreamingDataWithSimulcast) {
        const allSocialMediaHandles = liveStreamingDataWithSimulcast.socialMediaIds;
  
        for (let i = 0; i < allSocialMediaHandles.length; i++) {
          const element = allSocialMediaHandles[i];
  
          // Delete each social media streaming
          const removeSimulcast = await axios.delete(`${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}`, {
            params: {
              endpointServiceId: element.url,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.ANT_MEDIA_AUTH,
            },
          });
          console.log('removeSimulcast', removeSimulcast.data);
  
          // Update element
          const markAsDelete = await socialMediaStreamingModel.findOneAndUpdate(
            { _id: element._id },
            { $set: { isDeleted: true } }
          );
          console.log('Removed and marked simulcast data as deleted', markAsDelete);
  
          const updateLiveStreamingModel = await liveStreamModel.findOneAndUpdate(
            { streamKey: liveStreamId },
            { $pull: { socialMediaIds: element._id } }
          );
          console.log('Removed and marked updateLiveStreamingModel as deleted', updateLiveStreamingModel);
        }
  
        const config = {
          method: 'DELETE',
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.ANT_MEDIA_AUTH,
          },
        };
  
        console.log('Config:', config);
  
        const streamData = await axios(config);
        console.log('Live Streaming cleared and stopped');
        liveStreamingDataWithSimulcast.isDeleted = true;
        const updatedDelete = await liveStreamingDataWithSimulcast.save();
        console.log(updatedDelete);
        return { status: true, msg: 'Deleted Live Stream Successfully', data: updatedDelete };
      } else {
        console.log('No live streaming data found');
        return { status: false, msg: 'No live streaming data found' };
      }
    } catch (error) {
      console.error('Error:', error);
      return { status: false, code: 500, msg: error.message };
    }
  },
  deleteSocialMedaStream: async function(req){
    try {
      const liveStreamId = req.body.liveStreamId;
      const socialMediaUrl = req.body.url;
      const removeSimulcast = await axios.delete(`${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}`, {
        params: {
          endpointServiceId: socialMediaUrl,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.ANT_MEDIA_AUTH,
        },
      });
      console.log('removed simulcast data',removeSimulcast.data)
     if(removeSimulcast.data.success){
      const deleteSimulcast = await socialMediaStreamingModel.findOneAndUpdate({url:socialMediaUrl}, {$set:{isDeleted:true}}, {new:true})
      const deleteLiveStreamEntry = await liveStreamModel.findOneAndUpdate({streamKey:liveStreamId}, { $pull: { socialMediaIds: deleteSimulcast._id } })
      return { status: true, msg: 'Deleted Live Stream Successfully' , data: 'Deleted Live Stream Successfully'  };
     }else {return {status: false, msg: "Already deleted"}}
      
    } catch (error) {
      console.error('Error:', error);
      return { status: false, code: 500, msg: error.message };
    }
  },
  getLiveStreamById:async function(req, res){
    try {
      const liveStreamId = req.query.id;
      const data = await liveStreamModel.findOne({
        _id:ObjectId(liveStreamId)
      }).populate('socialMediaIds');
      if(data){
        return {status: true, data: data}
      }else{
        return {status: false, msg:"No data found !"}
      }
    } catch (error) {
      return{status: false, code:500, msg: `${error.message}`}
    }
  },
  getAllLiveStreamsByUserId: async function (req){
    try {
      const userId = req.user.userId;
     const data =  await liveStreamModel.find({createdBy:ObjectId(userId)});
     if(data){
      return {status: true, data:data };
    }
    } catch (error) {
      return{status: false, code:500, msg: `${error.message}`}
    }
  },
  completeLiveStream : async function (req){
    try {
      const liveStreamId = req.query.id;
      const findLiveStream = await liveStreamModel.findOne({_id:ObjectId(liveStreamId)});
        let configForAnt = {

          method: "PUT",
          url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}`,
          headers: {
            "Content-Type": "application/json",
            Authorization:`${process.env.ANT_MEDIA_AUTH}`
          },
          data: {
            "status": "finished",
            "playListStatus": "finished",
            },
        }
      // let config = {
      //   method: "PUT",
      //   url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/complete`,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization:
      //       "Basic " +
      //       Buffer.from(
      //         `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
      //       ).toString("base64"),
      //   },
      // };
      const muxData = await axios(configForAnt);
      if(muxData){
        findLiveStream.status = 'finished';  
        await findLiveStream.save();   
        return {status:true, msg:"Live stream marked Completed !"}
      }
    } catch (error) {
      return{status: false, code:500, msg: `${error.message}`}
    }
  },
  deleteLiveStream: async function (req){
    try {
      const userId = req.user.userId;
     const deleteLiveStreamID = req.params.liveStreamId;
     if(!deleteLiveStreamID){
      return {status:false, code:400,msg:"No stream Id found in params"}
     }
      
      let configForAnt = {
        method: "DELETE",
        url: `${process.env.ANT_MEDIA_URL}broadcasts/${liveStreamId}/${deleteLiveStreamID}`,
        headers: {
          "Content-Type": "application/json",
          Authorization:`${process.env.ANT_MEDIA_AUTH}`
        },
      }
      const findStream = await liveStreamModel.findOne({liveStreamId:deleteLiveStreamID});
        findStream.isDeleted = true;
      const savedSaved = await findStream.save()
        console.log('config', savedSaved);
        const streamData = await axios(configForAnt);
        console.log('stream Data stream Data',streamData)
      if(streamData.data){
        return {status:false, code:200, msg:"Stream deleted successfully!"}
      }
    } catch (error) {
      console.log('ee',error )
      return {status: false, code :500, msg:`${error.message}`}
    }
  }
};