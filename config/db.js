const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI, );

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
