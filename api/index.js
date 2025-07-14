const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/database');
const authRoutes = require('../routes/authRoutes');

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
    await connectDB();
    isConnected = true;
  }
}

module.exports = async (req, res) => {
  await ensureDBConnection();
  return serverless(app)(req, res);
}; 