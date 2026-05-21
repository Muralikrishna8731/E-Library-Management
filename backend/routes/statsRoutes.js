const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const User = require("../models/User");

router.get("/stats", async (req, res) => {
  try {
    const [totalBooks, totalUsers, categories] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Book.distinct("category"),
    ]);

    res.json({
      totalBooks,
      totalUsers,
      totalCategories: categories.length,
      totalDownloads: 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/books/featured", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ _id: -1 })
      .limit(6)
      .select("title author category description pdfUrl");

    res.json(books);
  } catch (error) {
    console.error("Featured books error:", error);
    res.status(500).json({ message: "Failed to fetch featured books" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Book.aggregate([
      { $group: { _id: "$category", bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $project: { name: "$_id", bookCount: 1, _id: 0 } },
    ]);

    res.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;
