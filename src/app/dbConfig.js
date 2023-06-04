require('dotenv').config();

// const {MongoClient} = require('mongodb');
// const mongoose= require('mongodb');
const mongoose = require('mongoose');

// Connection URI
const uri = "mongodb+srv://gamermaticAdmin:Iig6vEI2Aks1z7lx@gamermaticdevcluster0.itqvjux.mongodb.net/gamermatic_dev?retryWrites=true&w=majority";

// Create a new MongoClient
// const client = new MongoClient(uri);
// const uri = "mongodb+srv://gamermaticAdmin:<password>@gamermaticdevcluster0.itqvjux.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
module.exports = {
  dbConnect: async function() {
    mongoose.set('strictQuery', true);
    mongoose
 .connect(uri)   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));
    // try {
    //   // Connect the client to the server (optional starting in v4.7)
    //   await client.connect();

    //   // Establish and verify connection
    //   await client.db('gamermatic_dev').command({ping: 1});

    //   console.log('Connected successfully to db server');
    // } finally {
    //   // Ensures that the client will close when you finish/error
    //   await client.close();
    // }
  },
};
