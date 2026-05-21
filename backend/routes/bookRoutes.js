const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const Book = require("../models/Book");
const { protect, admin } = require("../middleware/auth");

const uploadDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const filenameBase = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${filenameBase}${path.extname(file.originalname).toLowerCase() || ".pdf"}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/add", protect, admin, (req, res) => {
  upload.single("pdf")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    try {
      const { title, author, category, description } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "PDF file is required" });
      }

      const resolvedUploadPath = path.resolve(req.file.path);
      const resolvedUploadDirectory = `${path.resolve(uploadDirectory)}${path.sep}`;
      if (!resolvedUploadPath.startsWith(resolvedUploadDirectory)) {
        return res.status(400).json({ message: "Invalid upload path" });
      }

      const headerBuffer = Buffer.alloc(5);
      const uploadedFileHandle = await fs.promises.open(resolvedUploadPath, "r");
      try {
        await uploadedFileHandle.read(headerBuffer, 0, 5, 0);
      } finally {
        await uploadedFileHandle.close();
      }
      const fileHeader = headerBuffer.toString();
      if (fileHeader !== "%PDF-") {
        await fs.promises.unlink(resolvedUploadPath).catch(() => {});
        return res.status(400).json({ message: "Uploaded file content is not a valid PDF" });
      }

      const book = new Book({
        title,
        author,
        category: category || "General",
        description: description || "",
        pdfUrl: `/uploads/${req.file.filename}`,
      });

      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
