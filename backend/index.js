const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api", statsRoutes);

app.get("/", (_req, res) => {
  res.send("E-Library Backend Pipeline Active");
});

app.use((err, _req, res, _next) => {
  console.error("UNHANDLED ERROR:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

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
  mongoose
    .connect(process.env.MONGO_URI, {
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


