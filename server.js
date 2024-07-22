const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/users', authRoutes);
app.use('/api/contacts', contactRoutes);

// Modified server start function
const startServer = async (customDB) => {
  if (customDB) {
    app.locals.db = customDB;
  } else {
    await connectDB();
  }

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Server running on port ${PORT}`);
    }
  });
  return server;
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };