const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

/* =========================
   CORS FIRST (IMPORTANT)
========================= */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
// MIDDLEWARES
app.use(cors());
app.use(express.json());


// STATIC FOLDER FOR PDF FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ROUTES
const bookRoutes = require("./routes/bookRoutes");

// Serving the 'uploads' folder statically so PDFs can be accessed via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

/* =========================
   BASE ROUTE
// --- 4. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --- 5. Base Route ---

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("E-Library Backend Pipeline Active");
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
});

/* =========================
   DB CONNECT
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

/* =========================
   START SERVER
========================= */
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
