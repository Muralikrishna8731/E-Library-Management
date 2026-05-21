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

  category: {
    type: String,
    default: "Textbooks"
  },

  pdfUrl: {
    type: String
  },

  coverUrl: {
    type: String,
    default: ""
  },

  isPdfVerified: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["pending", "published", "approved", "rejected"],
    default: "pending"
  },

  rejectionReason: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Book", bookSchema);