const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const Book = require("../models/Book");

const useMockDb = process.env.USE_MOCK_DB === "true";
const mockBooks = [];

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

router.post("/add", (req, res) => {
  upload.single("pdf")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    try {
      const { title, author } = req.body;

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

      const bookData = {
        title,
        author,
        pdfUrl: `/uploads/${req.file.filename}`,
      };

      if (useMockDb) {
        const book = {
          id: crypto.randomUUID(),
          ...bookData,
          createdAt: new Date().toISOString(),
        };
        mockBooks.push(book);
        return res.status(201).json(book);
      }

      const book = new Book(bookData);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    if (useMockDb) {
      return res.json(mockBooks);
    }
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    if (useMockDb) {
      const index = mockBooks.findIndex((book) => book.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
      }
      mockBooks[index] = {
        ...mockBooks[index],
        ...req.body,
      };
      return res.status(200).json(mockBooks[index]);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    if (useMockDb) {
      const index = mockBooks.findIndex((book) => book.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
      }
      mockBooks.splice(index, 1);
      return res.status(200).json({ message: "Book deleted successfully" });
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
