const userModel = require("../models/userModel");
const { generateOtp } = require("../utils/helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require('joi');
const SALT_ROUNDS = 10;

module.exports = {
  register: async function (req) {
    try {
      console.log("inside controllw");
      const { email } = req.body;
      const newOtp = generateOtp();
      const user = await userModel.findOne({ email: email });
      console.log("------------------------------", user);
      if (user) {
        return { status: false, code: 200, msg: "User already exist" };
      } else {
        let newUser = new userModel();
        newUser.email = email;
        newUser.otp = newOtp;
        await newUser.save();
        const { MailtrapClient } = require("mailtrap");

        const TOKEN = "dbceb6b2925281dec328a87dde00980a";
        const ENDPOINT = "https://send.api.mailtrap.io/";

        const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

        return {
          status: true,
          code: 200,
          msg: "Otp generated and sent to registered email address",
          data: newUser,
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  verifyOtp: async function (req) {
    try {
      console.log("inside controllw");
      const { email, otp } = req.body;
      const user = await userModel.findOne({ email: email });
      if (user.otp === otp) {
        return { status: true, code: 200, msg: "Otp Verified Successfully" };
      } else {
        return { status: false, code: 404, msg: "Incorrect otp!" };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  signUp: async function (req) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().optional(),
        password: Joi.string().required(),
        organization: Joi.string().optional(),
        userType: Joi.string().optional(),
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) {
        return {
          status: false,
          code: 400,
          msg: error.details[0].message,
        };
      }
  
      const { email, phoneNumber, password, organization, userType } = value;
  
      const existingUser = await userModel.findOne({ email });
  
      if (existingUser) {
        return { status: false, code: 409, msg: 'Email already exists' };
      }
  
      const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUser = new userModel({
        email,
        phoneNumber,
        password: encryptedPassword,
        organization: organization || '',
        // userType: userType || '',
      });
  
      await newUser.save();
  
      return { status: true, code: 200, msg: 'User created successfully!' };
    } catch (error) {
      console.error(error);
      return { status: false, code: 500, msg: 'Internal server error' };
    }
  },
  login: async function (req) {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      if (!(email && password)) {
        return { status: false, msg: `All inputs are required` };
      }
      const registeredDetails = await userModel.findOne({ email: email });
      console.log(registeredDetails);
      const compare = await bcrypt.compare(
        password,
        registeredDetails.password
      );
      console.log("compare", compare);
      if (
        registeredDetails &&
        (await bcrypt.compare(password, registeredDetails.password))
      ) {
        const updateUser = await userModel.findOneAndUpdate(
          { email: email },   
          {
            active: true,
            lastActive: new Date(),
          }
        );
        const token = jwt.sign(
          { userId: registeredDetails._id, email: registeredDetails.email },
          "secretKey"
        );

        return { status: true, code: 200, data: { token: token } };
      } else {
        return {
          status: false,
          code: 404,
          msg: "Email and password mismatched while login !",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  getProfileData: async function(req){
    try {
      const {email} = req.query;
      const userData = await userModel.findOne({email:email},'name userType phoneNumber email')
      if(userData){
        return {status:true,   code: 200, data: userData}
      }

    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
    }
  },
  updateUser : async function(req){
    try{
      const { userId, email, phoneNumber, organization, userType, name, password } = req.body;

  
      let existingUser = await userModel.findById(userId);

      if (!existingUser) {
        return {
          status: false,
          code: 404,
          msg: 'User not found',
        };
      }
  
      //existingUser.email = email || existingUser.email;
      existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
      // existingUser.organization = organization || existingUser.organization;
      // existingUser.userType = userType || existingUser.userType;
      // existingUser.password = password || existingUser.password;
      existingUser.name = name || existingUser.name
  
      await existingUser.save();
  
      return {
        status: true,
        code: 200,
        msg: 'User information updated successfully',
        data: existingUser,
      };
    }catch(err){
      return {status:false, msg: `${error.message}`}

    }
  }
  
};
