const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
    streamKey :{
        type: String
    },
    createdBy:{
        type:ObjectId,
        ref:"user"
    },
    gameListId: {
        type:ObjectId,
        ref:"gameList"
    },
    status: {
        type:String,
    },
    muxStreamingId:{
        type:String
    },
    startTime:{
        type:Number
    },
    endTime:{
        type:Number
    },
    socialMediaIds:[{ type : ObjectId, ref: 'socialMediaStream' }],
    playbackId:{type:String}
},{timestamps:true})
module.exports = mongoose.model('liveStream', liveStreamSchema);
