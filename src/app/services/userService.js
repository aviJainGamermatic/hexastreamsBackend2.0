const userModel = require("../models/userModel");
const { generateOtp } = require("../utils/helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

        const sender = {
          email: "mailtrap@hexaesports.in",
          name: "Mailtrap Test",
        };
        const recipients = [
          {
            email: "xdproevents@gmail.com",
          },
        ];

        client
          .send({
            from: sender,
            to: recipients,
            subject: "You are awesome!",
            text: `Congrats for sending test email with Mailtrap! OTP - ${newOtp}`,
            category: "Integration Test",
          })
          .then(console.log, console.error);

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
      const { email, otp, phoneNumber, password, organization, userType } =
        req.body;
      const registeredDetails = await userModel.findOne({
        email: email,
        otp: otp,
      });
      console.log("registeredDetails after find", registeredDetails);
      if (!password) {
        return { status: false, code: 404, msg: "Password is required!" };
      }
      if (!userType) {
        return { status: false, code: 404, msg: "User type is required!" };
      }
      if (registeredDetails) {
        registeredDetails.phoneNumber = phoneNumber ? phoneNumber : null;
        const encryptedPassword = await bcrypt.hash(password, 10);
        registeredDetails.userType = userType;
        registeredDetails.password = encryptedPassword
          ? encryptedPassword
          : null;
        registeredDetails.organization = organization ? organization : "";
        await registeredDetails.save();
        // save user token
        return { status: true, code: 200, msg: "User created Successfully !" };
      } else {
        return {
          status: false,
          code: 404,
          msg: "Email or otp mismatched while creating account!",
        };
      }
    } catch (error) {
      return { status: false, code: 500, msg: `${error.message}` };
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
};
