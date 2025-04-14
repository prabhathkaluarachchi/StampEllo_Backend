const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// Stamp Schema & Model
const Stamp = mongoose.model("Stamp", {
  title: String,
  year: String,
  description: String,
  country: String,
  value: String,
  category: String,
  image: String,
});

// Admin Schema & Model (for 'admin' collection)
const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema({
    password: String,
    serviceId: String,
    templateId: String,
    publicKey: String
  }),
  "admin"
);

// GET Admin Details (All 4 Fields)
app.get("/api/admin/details", async (req, res) => {
  try {
    const admin = await Admin.findOne(); // gets the first document
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    res.json({
      password: admin.password,
      serviceId: admin.serviceId,
      templateId: admin.templateId,
      publicKey: admin.publicKey
    });
  } catch (err) {
    console.error("Error fetching admin details:", err.message);
    res.status(500).json({ error: "Failed to fetch admin details" });
  }
});


// GET Stamps (optional filter by category)
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

    const newStamp = new Stamp({
      title,
      year,
      description,
      country,
      value,
      category,
      image,
    });
    await newStamp.save();

    res
      .status(201)
      .json({ message: "Stamp added successfully", stamp: newStamp });
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
























// backup code for server.js 2025-04-13
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// const app = express();

// // Ensure 'uploads' folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Middleware
// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type"],
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// // Multer Storage Setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.replace(/\s+/g, "-");
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Test Route
// app.get("/", (req, res) => {
//   res.send("🚀 Backend is running");
// });

// // Stamp Schema & Model
// const Stamp = mongoose.model("Stamp", {
//   title: String,
//   year: String,
//   description: String,
//   country: String,
//   value: String,
//   category: String,
//   image: String,
// });

// // Admin Schema & Model (for admindb collection)
// const Admin = mongoose.model(
//   "Admin",
//   new mongoose.Schema({
//     password: String,
//   }),
//   "admin"
// ); // explicitly using 'admin' as the collection name

// // GET Admin Password
// app.get("/api/admin/password", async (req, res) => {
//   try {
//     const admin = await Admin.findOne(); // gets the first document
//     if (!admin) return res.status(404).json({ error: "Admin not found" });
//     res.json({ password: admin.password });
//   } catch (err) {
//     console.error("Error fetching admin password:", err.message);
//     res.status(500).json({ error: "Failed to fetch admin password" });
//   }
// });

// // GET Stamps (optional filter by category)
// app.get("/api/stamps", async (req, res) => {
//   const { category } = req.query;
//   try {
//     const stamps = await Stamp.find(category ? { category } : {});
//     res.json(stamps);
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).json({ error: "Failed to fetch stamps" });
//   }
// });

// // ADD New Stamp
// app.post("/api/stamps/add", upload.single("image"), async (req, res) => {
//   try {
//     const { title, year, description, country, value, category } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : "";

//     const newStamp = new Stamp({
//       title,
//       year,
//       description,
//       country,
//       value,
//       category,
//       image,
//     });
//     await newStamp.save();

//     res
//       .status(201)
//       .json({ message: "Stamp added successfully", stamp: newStamp });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).json({ error: "Failed to add stamp" });
//   }
// });

// // DELETE Stamp by ID
// app.delete("/api/stamps/:id", async (req, res) => {
//   try {
//     const deleted = await Stamp.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Stamp not found" });
//     res.json({ message: "Stamp deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Delete failed" });
//   }
// });

// // UPDATE Stamp by ID (excluding image)
// app.put("/api/stamps/:id", async (req, res) => {
//   try {
//     const updated = await Stamp.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ error: "Stamp not found" });
//     res.json({ message: "Stamp updated successfully", stamp: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Update failed" });
//   }
// });

// // Serve Uploaded Images
// app.use("/uploads", express.static("uploads"));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));










