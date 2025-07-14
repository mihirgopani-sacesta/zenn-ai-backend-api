// index.js : This file will now act as the main entry point for a traditional web service deployment.
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database'); // Assuming config/database.js is at the same level as index.js
const authRoutes = require('./routes/authRoutes'); // Assuming routes/authRoutes.js is at the same level as index.js

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Zenn AI Backend API is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

let isConnected = false;
async function ensureDBConnection() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      process.exit(1); // Exit if DB connection fails
    }
  }
}

// Get the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

async function startServer() {
  await ensureDBConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

// No need for module.exports in this context for a traditional server
// module.exports = async (req, res) => {
//   await ensureDBConnection();
//   return serverless(app)(req, res);
// };