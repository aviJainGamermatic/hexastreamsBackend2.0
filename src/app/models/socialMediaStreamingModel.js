const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const socialMediaStreamingSchema = new mongoose.Schema(
  {
    liveStreamId: {
      type: ObjectId,
      ref: "liveStream",
    },
    platformName: {
      type: String,
      enum: ["youtube", "twitch", "facebook"],
    },
    muxSimulcastId: {
      type: String,
    },
    url: { type: String },
    streamKey: { type: String },
    status: { type: String },
    passthrough: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy:{
        type:ObjectId,
        ref:'user'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "socialMediaStream",
  socialMediaStreamingSchema
);
