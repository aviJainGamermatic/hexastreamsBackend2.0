require('dotenv').config();

const {MongoClient} = require('mongodb');
// Connection URI
const uri = process.env.DB_DEV_URL;

// Create a new MongoClient
const client = new MongoClient(uri);

module.exports = {
  dbConnect: async function() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();

      // Establish and verify connection
      await client.db('admin').command({ping: 1});

      console.log('Connected successfully to db server');
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  },
};
