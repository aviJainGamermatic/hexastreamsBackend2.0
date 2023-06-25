const { func } = require("joi");
const liveStreamingService = require("../services/liveStreamingService.js");

module.exports = {
  verify: async function (req, res) {
    try {
      const result = await liveStreamingService.verify(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  createRoom: async function (req, res) {
    try {
      const result = await liveStreamingService.createRoom(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  deleteRoom: async function (req, res) {
    try {
      const result = await liveStreamingService.deleteRooms(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },

  createLiveStream: async function (req, res) {
    try {
      const result = await liveStreamingService.createLiveStream(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  liveStreamInYoutube: async function (req, res) {
    try {
      const result = await liveStreamingService.restreamToYoutube(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  liveStreamInFacebook: async function (req, res) {
    try {
      const result = await liveStreamingService.restreamToFacebook(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  liveStreamInTwitch: async function (req, res) {
    try {
      const result = await liveStreamingService.restreamToTwitch(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  stopLiveStreaming: async function (req, res) {
    try {
      const result = await liveStreamingService.stopLiveStreaming(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  getLiveStreamingInfoByStreamingId: async function (req, res) {
    try {
      const result = await liveStreamingService.getLiveStreamById(req);
      if (result.status) return res.json({ success: true, data: result });
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  getLiveStreaminListByUserId: async function (req, res) {
    try {
      const result = await liveStreamingService.getAllLiveStreamsByUserId(req);
      if (result.status) return res.json({ success: true, data: result.data});
      else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  markLiveStreamComplete: async function (req, res) {
    try {
      const result = await liveStreamingService.completeLiveStream(req);
      if (result.status) {
        return res.json({ success: true, data: result });
      } else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  deleteAllLiveStreamOfUser: async function (req, res) {
    try {
      const result = await liveStreamingService.deleteLiveStream(req);
      if (result.status) {
        return res.json({ success: true, data: result });
      } else return res.json({ success: false, msg: result.msg });
    } catch (error) {
      return res.json({ success: false, msg: error.message });
    }
  },
  deleteSocialMedaStream: async function (req, res){
    try{
      const result = await liveStreamingService.deleteSocialMedaStream(req);
      if (result.status) {
        return res.json({ success: true, data: result });
      } else return res.json({ success: false, msg: result.msg });

    }catch(error){
      return res.json({ success: false, msg: error.message });
    }
  }
};
