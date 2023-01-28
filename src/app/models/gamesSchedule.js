const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const gameModelSchema = new mongoose.Schema(
    {
        title:{type: String},
        thumbnailUrl:{
            type:String
        },
        eventDate:{type:String},
        eventTime:{
            type:String
        },
        streamingPlatform:[
            {
                type:Object
            }
        ],
        isDeleted:{type:Boolean, default:false},
        createdBy:{
            type:ObjectId,
            ref:'user'
        },
        endDate:{
            type:String
        },
        endTime:{
            type:String
        }


    },{timestamps:true})


    module.exports = mongoose.model('gameList', gameModelSchema);