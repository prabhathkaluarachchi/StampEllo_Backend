const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
// app.use(cors());
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

app.use(express.json());

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "-");
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// MongoDB Connection
mongoose
  .connect("mongodb+srv://stampello:STMPDBlog2025@cluster0.bx9fhwy.mongodb.net/stampello?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Stamp Schema
const Stamp = mongoose.model("Stamp", {
  title: String,
  year: String,
  description: String,
  country: String,
  value: String,
  category: String,
  image: String,
});

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// GET Stamps (filter by category)
app.get("/api/stamps", async (req, res) => {
  const { category } = req.query;
  try {
    const stamps = await Stamp.find(category ? { category } : {});
    res.json(stamps);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to fetch stamps" });
  }
});

// ADD New Stamp
app.post("/api/stamps/add", upload.single("image"), async (req, res) => {
  try {
    const { title, year, description, country, value, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newStamp = new Stamp({ title, year, description, country, value, category, image });
    await newStamp.save();

    res.status(201).json({ message: "Stamp added successfully", stamp: newStamp });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to add stamp" });
  }
});

// DELETE Stamp by ID
app.delete("/api/stamps/:id", async (req, res) => {
  try {
    const deleted = await Stamp.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Stamp not found" });
    res.json({ message: "Stamp deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// UPDATE Stamp by ID (excluding image)
app.put("/api/stamps/:id", async (req, res) => {
  try {
    const updated = await Stamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Stamp not found" });
    res.json({ message: "Stamp updated successfully", stamp: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Serve Uploaded Images
app.use("/uploads", express.static("uploads"));

// Start Server
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
//     // Use original filename (optional: make the name safe for URL)
//     const fileName = file.originalname.replace(/\s+/g, '-');  // Replace spaces with hyphens (optional)
//     cb(null, fileName);  // Save the file with its original name
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





