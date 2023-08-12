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
    linkedaccount:{
        type:ObjectId,
        ref:"Account",
    },
    gameListId: {
        type:ObjectId,
        ref:"gameList"
    },
    status: {
        type:String,
    },
    startTime:{
        type:Number
    },
    endTime:{
        type:Number
    },
    socialMediaIds:[{ type : ObjectId, ref: 'socialMediaStream' }],
    isDeleted:{
        type:Boolean,
        default:false
    },
    streamType: {
        type: String,
        enum : ['team', 'individual']
    },
    teamId: {
        type: ObjectId,
        ref: "Team"
    }
},{timestamps:true})
module.exports = mongoose.model('liveStream', liveStreamSchema);
