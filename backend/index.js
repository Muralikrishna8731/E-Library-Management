const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();


// MIDDLEWARES
app.use(cors());
app.use(express.json());


// STATIC FOLDER FOR PDF FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ROUTES
const bookRoutes = require("./routes/bookRoutes");

app.use("/api/books", bookRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("E-Library Backend Running");
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