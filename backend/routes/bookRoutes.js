const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const Book = require("../models/Book");


// ==========================
// Upload Directory
// ==========================

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}


// ==========================
// Multer Storage
// ==========================
// --- Multer Storage Configuration ---
const useMockDb = process.env.USE_MOCK_DB === "true";
const mockBooks = [];

const uploadDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  }
    // Generate a unique filename using timestamp and UUID
    const filenameBase = `${Date.now()}-${crypto.randomUUID()}`;
    const extension = path.extname(file.originalname).toLowerCase() || ".pdf";
    cb(null, `${filenameBase}${extension}`);
    const filenameBase = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${filenameBase}${path.extname(file.originalname).toLowerCase() || ".pdf"}`);
  },
});


// ==========================
// Multer Upload
// ==========================

const upload = multer({
  storage,

  fileFilter: (_req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "pdf") {

      if (
        file.mimetype === "application/pdf" ||
        ext === ".pdf"
      ) {
        return cb(null, true);
      }

      return cb(new Error("Only PDF files allowed"));
    }

    if (file.fieldname === "cover") {

      if (
        file.mimetype.startsWith("image/") ||
        [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
      ) {
        return cb(null, true);
      }

      return cb(new Error("Only image files allowed"));
    }

    cb(null, true);
  }
});


// =======================================================
// ADMIN ADD BOOK
// =======================================================

router.post("/add", (req, res) => {

  // Use multer middleware to handle the 'pdf' field
router.post("/add", (req, res) => {
  upload.single("pdf")(req, res, async (uploadError) => {

    if (uploadError) {
      return res.status(400).json({
        message: uploadError.message
      });
    }

    try {

      const {
        title,
        author,
        category,
        coverUrl
      } = req.body;

      if (!title || !author) {
        return res.status(400).json({
          message: "Title and author required"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "PDF file required"
        });
      }

      // PDF verification
      const filePath = path.resolve(req.file.path);

      const buffer = Buffer.alloc(5);

      const fileHandle = await fs.promises.open(filePath, "r");

      try {
        await fileHandle.read(buffer, 0, 5, 0);
      } finally {
        await fileHandle.close();
      }

      const header = buffer.toString();

      if (header !== "%PDF-") {

        await fs.promises.unlink(filePath).catch(() => {});

        return res.status(400).json({
          message: "Invalid PDF file"
        });
      }

    const book = new Book({
  title,
  author,
  category: category || "Textbooks",
  coverUrl,
  pdfUrl: `/uploads/${req.file.filename}`,
  status: "published",
  rejectionReason: ""
});

      await book.save();

      res.status(201).json(book);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  });

});


// =======================================================
// USER SUBMISSION
// =======================================================

router.post("/submissions/create", (req, res) => {

  const pdfFile = req.files["pdf"][0];

let coverPath = "";

if (req.files["cover"]) {
  coverPath = `/uploads/${req.files["cover"][0].filename}`;
}

router.post("/submissions/create", (req, res) => {
  const multiUpload = upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]);

  multiUpload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    try {
      const { title, author, category } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: "Title and author required" });
      }

      if (!req.files || !req.files["pdf"]) {
        return res.status(400).json({ message: "PDF required" });
      }

      const pdfFile = req.files["pdf"][0];

      let coverPath = "";
      if (req.files["cover"]) {
        coverPath = `/uploads/${req.files["cover"][0].filename}`;
      const fileHeader = headerBuffer.toString();
      if (fileHeader !== "%PDF-") {
        // Clean up invalid file
      const fileHeader = headerBuffer.toString();
      if (fileHeader !== "%PDF-") {
        await fs.promises.unlink(resolvedUploadPath).catch(() => {});
        return res.status(400).json({ message: "Uploaded file content is not a valid PDF" });
      }

      const newSubmission = new Book({
        title,
        author,
        category,
        pdfUrl: `/uploads/${pdfFile.filename}`,
        coverUrl: coverPath,
        status: "pending",
        rejectionReason: ""
      });

      await newSubmission.save();

      res.status(201).json(newSubmission);

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

  multiUpload(req, res, async (uploadError) => {

    if (uploadError) {
      return res.status(400).json({
        message: uploadError.message
      });
    }

    try {

      const {
        title,
        author,
        category
      } = req.body;

      if (!title || !author) {
        return res.status(400).json({
          message: "Title and author required"
        });
      }

      if (!req.files || !req.files["pdf"]) {
        return res.status(400).json({
          message: "PDF required"
        });
      }

      const pdfFile = req.files["pdf"][0];

      let coverPath = "";

      if (req.files["cover"]) {
        coverPath = `/uploads/${req.files["cover"][0].filename}`;
      }

    const newSubmission = new Book({
  title,
  author,
  category,
  pdfUrl: `/uploads/${pdfFilename}`,
  coverUrl: coverUrlPath,

  status: "pending",
  rejectionReason: ""
});

      await newSubmission.save();

      res.status(201).json(newSubmission);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  });

});


// =======================================================
// ADMIN FETCH PENDING
// =======================================================

router.get("/submissions", async (req, res) => {

  try {

    const submissions = await Book.find({
      status: "pending"
    });

    res.json(submissions);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// =======================================================
// USER STATUS TRACK
// =======================================================

router.get("/submissions/my-uploads", async (req, res) => {
  try {

    const submissions = await Book.find({
      status: {
        $in: ["pending", "approved", "rejected"]
      }
    });

    res.json(submissions);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// =======================================================
// ADMIN REVIEW
// =======================================================

router.post("/review/:id", async (req, res) => {

  try {

    const {
      approved,
      rejectionReason
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    if (approved) {

      book.status = "approved";
      book.rejectionReason = "";

    } else {

      book.status = "rejected";
      book.rejectionReason =
        rejectionReason || "Rejected by admin";

    }

    await book.save();

    res.json({
      message: approved
        ? "Approved"
        : "Rejected",
      book
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// =======================================================
// PUBLIC BOOKS
// =======================================================

router.get("/", async (req, res) => {

  try {

    const books = await Book.find({
      status: {
        $in: ["published", "approved"]
      }
    });

    if (useMockDb) {
      return res.json(mockBooks);
    }
    const books = await Book.find();
    res.json(books);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// =======================================================
// DELETE BOOK
// =======================================================

// ==========================
// DELETE SUBMISSION (USER)
// ==========================

router.delete("/submissions/:id", async (req, res) => {
  try {
    const submission = await Book.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Submission deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ==========================
// DELETE BOOK (FIX MISSING ROUTE)
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
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
