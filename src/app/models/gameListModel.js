
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const gameListSchema = new mongoose.Schema(
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


    module.exports = mongoose.model('gameList', gameListSchema);