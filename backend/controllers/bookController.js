const Book = require('../models/Book');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find(); // This looks inside your 'books' collection
    res.status(200).json(books);     // Sends the books back to your React app
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err.message });
  }
};