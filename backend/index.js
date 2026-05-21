const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// BookRoutes Available in backend/routes/bookRoutes

const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);

// 
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const statsRoutes = require("./routes/statsRoutes");
app.use("/api", statsRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
  console.error("MongoDB Connection Error:", err.message);
  console.error("Full error:", err);
});

app.get("/", (req, res) => {
  res.send("E-Library Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
