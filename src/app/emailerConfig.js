// const AWS = require('aws-sdk/client-ses');
require('dotenv').config();
let AWS = require('aws-sdk');
const ses = new AWS.SES({
  accessKeyId: `${process.env.SES_ACCESS_KEY}`,
  secretAccessKey: `${process.env.SES_SECRET_KEY}`,
  region: 'us-east-1',
});



let sendEmail = () => {
    let params = {
      Source: 'xdproevents@gmail.com',
      Destination: {
        ToAddresses: [
          "rahul.banjare95@gmail.com"
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'This is the body of my email!',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Hello, Rahul!`,
        }
      },
    };
    return ses.sendEmail(params).promise();
};
sendEmail()
// let transporter = nodemailer.createTransport({
//   SES: { ses, AWS },
// });

// transporter.sendMail(
//   {
//     from: "xdproevents@gmail.com",
//     to: "rahul.banjare95@gmail.com",
//     subject: "Message",
//     text: "I hope this message gets sent!",
//   },
//   (err, info) => {
//     console.log(info.envelope);
//     console.log(info.messageId);
//   }
// );

