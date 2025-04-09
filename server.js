const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// Define Stamp model
const Stamp = mongoose.model('Stamp', {
  title: String,
  year: String,
  description: String,
  country: String,
  value: String,
  image: String,
});

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

// API route to get all stamps
app.get('/api/stamps', async (req, res) => {
  try {
    const stamps = await Stamp.find();
    res.json(stamps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stamps' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
