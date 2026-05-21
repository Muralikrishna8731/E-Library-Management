const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  description: {
    type: String,
    default: "",
  },
  pdfUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Book", bookSchema);
