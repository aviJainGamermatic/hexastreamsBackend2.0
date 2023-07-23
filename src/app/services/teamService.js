const teamModel = require('../models/teams');
const crypto = require('crypto'); 
const { default: mongoose } = require('mongoose');
const generateSecretCode = () => {

  return new Promise((resolve, reject) => {

    crypto.randomBytes(4, (err, buf) => {
      if (err) {
        reject(err);
      }

      const secretCode = buf.toString('hex').toUpperCase(); 
      resolve(secretCode);
    });

  });

}

module.exports = {
    createTeam : async function(req){
        try {
            let bodyData = req.body;
            if(!bodyData.name){
                return {status: false, code :400, msg:'Name is required for creating a team'}
            }
            // if(!bodyData.createdBy){
            //     return {status: false, code :400, msg:'Manager is required for creating a team' }
            // }

            // create team
            bodyData.createdBy  = req.user.userId;
            const secretCode = await generateSecretCode();
            bodyData.secretCodeToJoin = secretCode;
            const newTeamCreated = await teamModel.create(bodyData)
            if(newTeamCreated){
                return {status: true, code :200, data:newTeamCreated }
            }
         
        } catch (error) {
            return {status:false, msg: error.message}
        }
    },
    updateTeam : async function(req){
        try {
            const teamId =  req.query.teamId;
            const bodyData = req.body;
            if (!teamId){
                return {status: false, code: 400, msg:'Team id is required to update'}
            }
            // now check the userId from token

            const userId =  req.user.userId
            // check if the team is created by user

            const team = await teamModel.findOne({_id:teamId, createdBy: userId, isDeleted:false})
            if(team== null){
                return {status:false, code :400, msg: 'Only team manager can update team! '}
            }
            // update 
            const update = await teamModel.findOneAndUpdate({_id:teamId, createdBy:userId},bodyData, {new:true})
            if(update){
                return {status: true, code :200, msg: 'Updated teams!', data: update}
            }
        } catch (error) {
            console.log('error', error);
            return {status: false, code: 500,msg:error.message}
            
        }
    },
    listMyTeams : async function (req){
        try {
            const userId = req.user.userId;
            if(!userId){
                return{status:false, code :400, msg: 'User Id required '}
            }
            // find my team ;
            const team = await teamModel.find({createdBy:userId, isDeleted:false}).populate('createdBy members', 'email')
            if(team){
                return {status: true, code :200, data: team}
            }else{
                return {status: true, code :200, data: []}
            }
        } catch (error) {
            console.log('error', error)
            return {status: false, code :500, msg: error.message}
        }
    },
    getTeamDetailsById : async function (req){
        try {
            const teamId = req.query.teamId;
            if (!teamId){
                return{status:false, code :400, msg: 'team Id required '}
            }
            const teamExists = await teamModel.exists({_id:teamId, isDeleted:false});
            if(teamExists == null){
                return {status:false, code :400, msg: 'team not found'}
            }
           
            const teamDetails = await teamModel.findOne({_id:teamId ,isDeleted:false}).populate('createdBy members', 'email').lean()
            if(teamDetails){
                return {status: true, code:200, data:teamDetails}
            }
            return {status: false, code:400, msg: "Unable to fetch team"}
           
        
               
        
            
        } catch (error) {
            console.log('error', error);
            return {status: false, code:500, msg: error.message}
        }
    },
    deleteTeam : async function (req){
        try {
            const teamId = req.query.teamId;
            if (!teamId){
                return{status:false, code :400, msg: 'team Id required '}
            }
            const now = Date.now();
            const teamDetails = await teamModel.findOneAndUpdate({_id:teamId}, {$set:{isDeleted: true, deletedAt: now}}, {new:true})
            if(teamDetails){
                return {status: true, code:200, msg: "Deleted successfully!"}
            }else{
                return {status: true, code:200, data: []}
            }
            
        } catch (error) {
            console.log('error', error);
            return {status: false, code:500, msg: error.message}
        }
    }
}