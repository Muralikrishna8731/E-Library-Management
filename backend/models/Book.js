const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);