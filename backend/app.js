// Backend entry point for Real Estate Listing App
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
// Allow all origins for CORS (for testing)
app.use(cors({ origin: '*', credentials: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

