const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
    // Use original filename (optional: make the name safe for URL)
    const fileName = file.originalname.replace(/\s+/g, '-');  // Replace spaces with hyphens (optional)
    cb(null, fileName);  // Save the file with its original name
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

























// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const app = express();

// // Ensure 'uploads' folder exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// // MongoDB Connection
// mongoose.connect('mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Define Stamp model with category field
// const Stamp = mongoose.model('Stamp', {
//   title: String,
//   year: String,
//   description: String,
//   country: String,
//   value: String,
//   category: String,  // Added category field
//   image: String,
// });

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 Backend is running');
// });

// // API route to get all stamps (optional category filter)
// app.get('/api/stamps', async (req, res) => {
//   const { category } = req.query;  // Get category filter from query params
//   try {
//     const filters = category ? { category } : {};  // Apply filter if category is provided
//     const stamps = await Stamp.find(filters);  // Find stamps based on the filter
//     res.json(stamps);
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch stamps' });
//   }
// });

// // API route to add a new stamp (Handle POST request with file upload)
// app.post('/api/stamps/add', upload.single('image'), async (req, res) => {
//   try {
//     const { title, year, description, country, value, category } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : '';  // Save image path if uploaded

//     const newStamp = new Stamp({
//       title,
//       year,
//       description,
//       country,
//       value,
//       category,  // Save category field
//       image,
//     });

//     await newStamp.save();
//     res.status(201).json({ message: 'Stamp added successfully', stamp: newStamp });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: 'Failed to add stamp' });
//   }
// });

// // Serve uploaded images
// app.use('/uploads', express.static('uploads'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





