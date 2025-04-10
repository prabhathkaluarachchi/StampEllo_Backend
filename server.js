const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// require('dotenv').config();

const app = express();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect('mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Stamp model with category field
const Stamp = mongoose.model('Stamp', {
  title: String,
  year: String,
  description: String,
  country: String,
  value: String,
  category: String,  // Added category field
  image: String,
});

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

// API route to get all stamps (optional category filter)
app.get('/api/stamps', async (req, res) => {
  const { category } = req.query;  // Get category filter from query params
  try {
    const filters = category ? { category } : {};  // Apply filter if category is provided
    const stamps = await Stamp.find(filters);  // Find stamps based on the filter
    res.json(stamps);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stamps' });
  }
});

// API route to add a new stamp (Handle POST request with file upload)
app.post('/api/stamps/add', upload.single('image'), async (req, res) => {
  try {
    const { title, year, description, country, value, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';  // Save image path if uploaded

    const newStamp = new Stamp({
      title,
      year,
      description,
      country,
      value,
      category,  // Save category field
      image,
    });

    await newStamp.save();
    res.status(201).json({ message: 'Stamp added successfully', stamp: newStamp });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to add stamp' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));













// const FormData = require('form-data');  // Import form-data for Node.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const axios = require('axios');
// const multer = require('multer');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Define Stamp model
// const Stamp = mongoose.model('Stamp', {
//   title: String,
//   year: String,
//   description: String,
//   country: String,
//   value: String,
//   category: String,
//   image: String,  // Store Imgur URL
// });

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 Backend is running');
// });

// // Multer setup for image upload
// const storage = multer.memoryStorage();  // Use memoryStorage to handle images
// const upload = multer({ storage });

// const IMGUR_CLIENT_ID = '1f5daf2325b02fa';  // Replace with your Imgur Client ID

// // Add new stamp with Imgur image upload
// app.post('/api/stamps/add', upload.single('image'), async (req, res) => {
//   try {
//     const { title, year, description, country, value, category } = req.body;
//     const imageBuffer = req.file.buffer;

//     // Upload image to Imgur
//     const formData = new FormData();
//     formData.append('image', imageBuffer.toString('base64'));  // Convert buffer to base64

//     const imgurResponse = await axios.post('https://api.imgur.com/3/image', formData, {
//       headers: {
//         'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
//         ...formData.getHeaders(),  // Add appropriate headers for form-data
//       },
//     });

//     const imageUrl = imgurResponse.data.data.link;  // Get the image URL from Imgur

//     const newStamp = new Stamp({
//       title,
//       year,
//       description,
//       country,
//       value,
//       category,
//       image: imageUrl,  // Save Imgur URL
//     });

//     await newStamp.save();
//     res.status(201).json({ message: 'Stamp added successfully', stamp: newStamp });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: 'Failed to add stamp' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));












// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Cloudinary config with direct API keys (no .env file)
// cloudinary.config({
//   cloud_name: 'stampello', // Your Cloudinary cloud name
//   api_key: '332231186378573', // Your Cloudinary API key
//   api_secret: '_apLJCLcVNocDCvoHTwZiccZ0HU', // Your Cloudinary API secret
// });

// // Multer + Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'stamps',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 800, height: 600, crop: 'limit' }],
//   },
// });
// const upload = multer({ storage });

// // MongoDB Connection
// mongoose.connect('mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Define Stamp model
// const Stamp = mongoose.model('Stamp', {
//   title: String,
//   year: String,
//   description: String,
//   country: String,
//   value: String,
//   category: String,
//   image: String,  // Store Cloudinary URL
// });

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 Backend is running');
// });

// // Add new stamp with Cloudinary image upload
// app.post('/api/stamps/add', upload.single('image'), async (req, res) => {
//   try {
//     const { title, year, description, country, value, category } = req.body;
//     const imageUrl = req.file ? req.file.path : '';  // Cloudinary URL in req.file.path

//     const newStamp = new Stamp({
//       title,
//       year,
//       description,
//       country,
//       value,
//       category,
//       image: imageUrl,  // Save Cloudinary URL
//     });

//     await newStamp.save();
//     res.status(201).json({ message: 'Stamp added successfully', stamp: newStamp });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: 'Failed to add stamp' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));












