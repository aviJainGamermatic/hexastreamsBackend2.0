const express = require('express');
const port = 5001;
const cors = require('cors');
const dbConfig = require('./dbConfig');
require('dotenv').config();
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.json());
app.use('/user', require('./routes/userRoutes'));
app.use("/game",require('./routes/gameRoutes') );
app.use("/live-stream",require("./routes/liveStreamingRoutes"));
dbConfig.dbConnect();


app.listen(port, () => {
  console.log(`GamerMatic app listening on port ${port}`);
});
app.get("/api", (req, res) => {

  res.send("Wlcome to gamermatic backed Service!!");
});



