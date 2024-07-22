const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db();
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const setDB = (database) => {
  db = database;
};

module.exports = { connectDB, getDB, setDB };