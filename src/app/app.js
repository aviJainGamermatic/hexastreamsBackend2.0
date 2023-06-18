const express = require('express');
const cookieParser = require('cookie-parser');


const port = 5000;
const cors = require('cors');
const dbConfig = require('./dbConfig');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/user', require('./routes/userRoutes'));
app.use("/game",require('./routes/gameRoutes') );
app.use("/live-stream",require("./routes/liveStreamingRoutes"));
app.use("/",require("./routes/youtubeRoutes"));
app.use("/razorpay",require("./routes/razorpayroutes"));
app.use("/twitch",require("./routes/twitchRoutes"));
dbConfig.dbConnect();


app.listen(port, () => {
  console.log(`GamerMatic app listening on port ${port}`);
});
app.get("/api", (req, res) => {

  res.send("Welcome to gamermatic backed Service!!");
});



