const { MailtrapClient } = require("mailtrap");


// Host: live.smtp.mailtrap.io
// Port: 587 (recommended), 2525 or 25
// Username: api
// pass: dbceb6b2925281dec328a87dde00980a
// Auth: PLAIN, LOGIN
// STARTTLS: Required

// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
const TOKEN = "your-api-token";
const SENDER_EMAIL = "sender@yourdomain.com";
const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Hello from Mailtrap!",
    text: "Welcome to Mailtrap Sending!",
  })
  .then(console.log, console.error);