const { default: axios } = require("axios");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const { findOne } = require("../models/liveStreamModel");
const liveStreamModel = require("../models/liveStreamModel");
const socialMediaStreamingModel = require("../models/socialMediaStreamingModel");

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
    try {
      config = {
        method: "POST",
        url: "https://api.mux.com/video/v1/live-streams",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
        data: {
          playback_policy: ["public"],
          new_asset_settings: {
            playback_policy: ["public"],
          },
        },
      };

      const muxData = await axios(config);
      console.log("mux mux mux", muxData.data);
      if (muxData) {
        const saveMuxData = await liveStreamModel.create({
          streamKey: muxData.data.data.stream_key,
          createdBy: req.user.userId,
          status: muxData.data.data.status,
          muxStreamingId: muxData.data.data.id,
          startTime: muxData.data.created_at,
          playbackId: muxData.data.data.playback_ids[0].id
        });

        return { status: true, data: saveMuxData };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  restreamToYoutube: async function (req) {
    const liveStreamId = req.body.liveStreamId;

    const youtube = req.body.youtube;
    try {
      let config = {
        method: "POST",
        url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/simulcast-targets`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
        data: {
          url: youtube.url,
          stream_key: youtube.streamKey,
          passthrough: youtube.passthrough,
        },
      };
      const streamData = await axios(config);
      if (streamData) {
        let livestreamData = await liveStreamModel.findOne({
          muxStreamingId: liveStreamId,
        });
        const simulcastData = await socialMediaStreamingModel.create({
          liveStreamId: ObjectId(livestreamData._id),
          platformName: "youtube",
          muxSimulcastId: streamData.data.data.id,
          url: streamData.data.data.url,
          streamKey: streamData.data.data.streamKey,
          status: streamData.data.data.status,
          passthrough: streamData.data.data.passthrough,
          createdBy: req.user.userId,
        });
        livestreamData.socialMediaIds.push(simulcastData._id);
        const saved = await livestreamData.save();
        return { status: true, data: streamData.data.data };
      } else {
        return {
          status: false,
          msg: "Error encountered while streaming in youtube",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  restreamToTwitch: async function (req) {
    const liveStreamId = req.body.liveStreamId;
    const twitch = req.body.twitch;
    try {
      config = {
        method: "POST",
        url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/simulcast-targets`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
        data: {
          url: twitch.url,
          stream_key: twitch.streamKey,
          passthrough: twitch.passthrough,
        },
      };
      const streamData = await axios(config);
      if (streamData) {
        let livestreamData = await liveStreamModel.findOne({
          muxStreamingId: liveStreamId,
        });
        const simulcastData = await socialMediaStreamingModel.create({
          liveStreamId: ObjectId(livestreamData._id),
          platformName: "twitch",
          muxSimulcastId: streamData.data.data.id,
          url: streamData.data.data.url,
          streamKey: streamData.data.data.streamKey,
          status: streamData.data.data.status,
          passthrough: streamData.data.data.passthrough,
          createdBy: req.user.userId,
        });
        livestreamData.socialMediaIds.push(simulcastData._id);
        const saved = await livestreamData.save();
        return { status: true, data: streamData.data.data };
      } else {
        return {
          status: false,
          msg: "Error encountered while streaming in Twitch",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  restreamToFacebook: async function (req) {
    const liveStreamId = req.body.liveStreamId;
    const facebook = req.body.facebook;
    try {
      config = {
        method: "POST",
        url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/simulcast-targets`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
        data: {
          url: facebook.url,
          stream_key: facebook.streamKey,
          passthrough: facebook.passthrough,
        },
      };
      const streamData = await axios(config);
      if (streamData) {
        let livestreamData = await liveStreamModel.findOne({
          muxStreamingId: liveStreamId,
        });
        const simulcastData = await socialMediaStreamingModel.create({
          liveStreamId: ObjectId(livestreamData._id),
          platformName: "facebook",
          muxSimulcastId: streamData.data.data.id,
          url: streamData.data.data.url,
          streamKey: streamData.data.data.streamKey,
          status: streamData.data.data.status,
          passthrough: streamData.data.data.passthrough,
          createdBy: req.user.userId,
        });

        livestreamData.socialMediaIds.push(simulcastData._id);
        const saved = await livestreamData.save();
        return { status: true, data: streamData.data.data };
      } else {
        return {
          status: false,
          msg: "Error encountered while streaming in Twitch",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  stopLiveStreaming: async function (req, res) {
    try {
      console.log('inside live streaming');
      const liveStreamId = req.body.muxStreamingId;
      const socialMediaStream = req.body.muxSimulcastId;
      console.log('live stream', liveStreamId, 'live stream 00', socialMediaStream);
      config = {
        method: "DELETE",
        url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/simulcast-targets/${socialMediaStream}`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
      };
      console.log('config', config);
      const streamData = await axios(config);
      console.log(streamData);
      if (streamData.code === 204) {
        const updateSocialMedia = await socialMediaStreamingModel.findOne(
          { liveStreamId: muxStreamingId, muxSimulcastId: socialMediaStream },
          { $set: { isDeleted: true } },{new:true}
        );
        const deleteLiveStreamSimulcastId =
          await liveStreamModel.findOneAndUpdate(
            {
              muxStreamingId: liveStreamId,
            },
            { $pull: { socialMediaIds: ObjectId(updateSocialMedia._id) } },
            { new: true }
          );
        return { status: true, msg: "Deleted Live Stream Succeffully" };
      } else {
        return {
          status: false,
          msg: "Error encountered while deleting live stream",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
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

      config = {
        method: "PUT",
        url: `https://api.mux.com/video/v1/live-streams/${liveStreamId}/complete`,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
            ).toString("base64"),
        },
      };
      const muxData = await axios(config);
      if(muxData){
        findLiveStream.status = 'Completed';  
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
      const data =  await liveStreamModel.find({createdBy:ObjectId(userId)});

      for (let i = 0; i < data.length; i++) {
        const element = data[i].muxStreamingId;
        console.log('element element', element);
        console.log('elelement.muxStreamingId', element);
        config = {
          method: "DELETE",
          url: `https://api.mux.com/video/v1/live-streams/${element}`,
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              Buffer.from(
                `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`
              ).toString("base64"),
          },
        };
        console.log('config', config);
        const streamData = await axios(config);
        console.log('stream Data stream Data',streamData)
      }
    } catch (error) {
      console.log('ee',error )
      return {status: false, code :500, msg:`${error.message}`}
    }


  }
};