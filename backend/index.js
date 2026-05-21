const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// --- 1. Import Routes ---
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// --- 2. Middleware ---
app.use(cors());
app.use(express.json());

// MIDDLEWARES
app.use(cors());
app.use(express.json());


// STATIC FOLDER FOR PDF FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ROUTES
const bookRoutes = require("./routes/bookRoutes");

// Serving the 'uploads' folder statically so PDFs can be accessed via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 3. Use Routes ---
app.use("/api/auth", authRoutes); // Authentication (Register/Login)
app.use("/api/books", bookRoutes); // Book management (Upload/List)

// --- 4. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --- 5. Base Route ---

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("E-Library Backend Running");
});

// --- 6. Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// SERVER
const PORT = process.env.PORT || 5000;
const useMockDb = process.env.USE_MOCK_DB === "true" || !process.env.MONGO_URI;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using ${useMockDb ? "mock" : "MongoDB"} database`);
  });
};

if (useMockDb) {
  console.log("Mock database mode enabled. Skipping MongoDB connection.");
  startServer();
} else {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB Connected");
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
  });
}
