const express = require('express');
const cookieParser = require('cookie-parser');
const passport= require ('passport');
const session = require('express-session');
const port = 5000;
const cors = require('cors');
const dbConfig = require('./dbConfig');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', require('./routes/userRoutes'));
app.use("/game",require('./routes/gameRoutes') );
app.use("/live-stream",require("./routes/liveStreamingRoutes"));
app.use("/youtube",require("./routes/youtubeRoutes"));
app.use("/razorpay",require("./routes/razorpayroutes"));
app.use("/twitch",require("./routes/twitchRoutes"));
dbConfig.dbConnect();


app.listen(port, () => {
  console.log(`GamerMatic app listening on port ${port}`);
});
app.get("/", (req, res) => {

  res.send("Welcome to gamermatic backend Service!!");
});



