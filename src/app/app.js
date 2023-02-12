const express = require('express');
const port = 3000;
const dbConfig = require('./dbConfig');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use('/user', require('./routes/userRoutes'));
app.use("/game",require('./routes/gameRoutes') )
dbConfig.dbConnect();

app.use(cors());
app.listen(port, () => {
  console.log(`GamerMatic app listening on port ${port}`);
});
app.use(function ())
app.get("/", (req, res) => {

  res.send("Wlcome to gamermatic backed Service!!");
});
