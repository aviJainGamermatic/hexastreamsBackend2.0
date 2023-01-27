const express = require('express');
const port = 3000;
const dbConfig = require('./dbConfig');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use('/user', require('./routes/userRoutes'));
dbConfig.dbConnect();

app.listen(port, () => {
  console.log(`GamerMatic app listening on port ${port}`);
});
