const teamModel = require('../models/teams');
const crypto = require('crypto'); 
const { default: mongoose } = require('mongoose');
// Configure AWS SES transporter
const nodemailer = require('nodemailer');
const { generateEmailContent } = require('../utils/helper');
const Team = require('../models/teams');
const { ObjectId } = require('mongodb');

const transporter = nodemailer.createTransport({
    host: process.env.SES_SMTP_ENDPOINT, // SES SMTP endpoint
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SES_USER_KEY,
      pass: process.env.SES_SECRET_KEY
    }
  });
const fromEmail = "info@gamermatic.in";

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
            if(!bodyData.createdBy){
                return {status: false, code :400, msg:'Manager is required for creating a team' }
            }
            if(bodyData.members){
                // check for unique ids in members
                 
            }


            // create team
            bodyData.createdBy  = req.user.userId;

            // const secretCode = await generateSecretCode();
            // bodyData.secretCodeToJoin = secretCode;
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
            const teamDetails = await Team.findOne({_id:teamId ,isDeleted:false}).populate('createdBy joinedUsers members', 'email').lean();
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
    },
    sendInvitationLink: async function(req){
        try {
            const teamId = req.query.teamId;
            const usersToSendInvites = req.body.members;
            const fetchTeamDetails = await Team.findOne({_id:ObjectId(teamId)}).populate('members createdBy', "email name");
            if(fetchTeamDetails){
                const invitations =fetchTeamDetails.members  
                const managerName = fetchTeamDetails.createdBy.name;
                for(let user of invitations) {
                    // Generate unique invite link 
                    // Send invite email
                    let info = await transporter.sendMail({
                      from: 'info@gamermatic.in',
                      to: user.email,
                      subject: `You are invited to join a team by ${managerName}`,
                      html: generateEmailContent(user.name ?user.name  : "User", `You are invited to join ${fetchTeamDetails.name ?fetchTeamDetails.name: fetchTeamDetails.email }`, `🎉 Your talents and enthusiasm make you the perfect fit for our crew. 🌟

                      Click the link below to embark on a thrilling journey filled with endless opportunities`, `Click to Join`, `http://dev.hexastreams.com/verification/link/${fetchTeamDetails._id}/${user._id}`),
                    });
            
                  }
            }
            if(!teamId) {
              return {status: false, code: 400, msg: 'Team id required'};  
            }
      
            if(!usersToSendInvites) {
              return {status: false, code: 400, msg: 'Members required'};
            }
      
            // Send email to each member

            
            return {status: true};
      
          } catch(error) {
            console.log(error)
            return {status: false, code: 500, msg: error.message}; 
          }
        },
        joinTheTeam: async function(req) {
            try {
              const teamId = req.query.teamId;
              const memberId = req.query.memberId;
          
              // Assuming 'Team' is the Mongoose model for the teams collection
              const findTheTeamAndMember = await Team.findOne({
                teamId: ObjectId(teamId),
                members: { $in: [ObjectId(memberId)] },
              });
          
              if (!findTheTeamAndMember) {
                return { status: false, code: 404, data: 'Team or member not found.' };
              }
          
              const filteredMembers = findTheTeamAndMember.members.filter(
                (element) => element.toString() === memberId.toString()
              )[0];
          
              // Update the teams model
              const updateTeam = await Team.updateOne(
                { _id: ObjectId(teamId) },
                {
                  $pull: { members: { $in: filteredMembers } },
                  $push: { joinedUsers: ObjectId(filteredMembers) },
                }
              );
              if (updateTeam.nModified === 0) {
                return { status: false, code: 500, data: 'Failed to join the team.' };
              }
          
              return { status: true, code: 200, data: 'Team joined successfully!' };
            } catch (error) {
              // Handle any unexpected errors
              console.error('Error joining the team:', error);
              return { status: false, code: 500, data: 'An error occurred while joining the team.' };
            }
          },
          userDetailsOfTeams : async  (req) =>{
            try {
                const userId = req.user.userId
                const teamsCreatedByUser = await Team.find({ createdBy: ObjectId(userId) })
                .select('name joinedUsers createdBy')
                .populate('joinedUsers', 'name email') // Assuming 'name' is a field in the 'User' model
                .populate('createdBy', 'name email'); // Assuming 'name' is a field in the 'User' model
          
              // Find the teams where the user is joined and populate the 'joinedUsers' and 'createdBy' fields
              const teamsJoinedByUser = await Team.find({ joinedUsers: ObjectId(userId) })
                .select('name joinedUsers createdBy')
                .populate('joinedUsers', 'name email') // Assuming 'name' is a field in the 'User' model
                .populate('createdBy', 'name email'); // Assuming 'username' is a field in the 'User' model
          
              const teamsCreatedByUserFormatted = teamsCreatedByUser.map((team) => ({
                name: team.name,
                joinedUsers: team.joinedUsers,
                createdBy: team.createdBy,
              }));
          
              const teamsJoinedByUserFormatted = teamsJoinedByUser.map((team) => ({
                name: team.name,
                joinedUsers: team.joinedUsers.filter((user) => user.toString() !== userId.toString()),
                createdBy: team.createdBy,
              }));
            
                return { status: true, data: { teamsCreatedByUser: teamsCreatedByUserFormatted, teamsJoinedByUser: teamsJoinedByUserFormatted } };
              } catch (error) {
                console.error('Error fetching user teams information:', error);
                return { status: false, msg: 'An error occurred while fetching user teams information.' };
              }
            }
    

}