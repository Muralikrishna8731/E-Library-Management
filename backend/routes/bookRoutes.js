const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const Book = require("../models/Book");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  filename: (_req, file, cb) => {
    const filenameBase = `${Date.now()}-${crypto.randomUUID()}`;
    const extension = path.extname(file.originalname).toLowerCase() || ".pdf";
    cb(null, `${filenameBase}${extension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf" || ext === ".pdf") return cb(null, true);
      return cb(new Error("Only PDF files allowed"));
    }

    if (file.fieldname === "cover") {
      if (file.mimetype.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        return cb(null, true);
      }
      return cb(new Error("Only image files allowed"));
    }

    return cb(null, true);
  },
});

const validatePdfHeader = async (filePath) => {
  const buffer = Buffer.alloc(5);
  const fileHandle = await fs.promises.open(path.resolve(filePath), "r");
  try {
    await fileHandle.read(buffer, 0, 5, 0);
  } finally {
    await fileHandle.close();
  }
  return buffer.toString() === "%PDF-";
};

router.post("/add", verifyToken, isAdmin, (req, res) => {
  upload.single("pdf")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    try {
      const { title, author, category, description, coverUrl } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: "Title and author required" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "PDF file required" });
      }

      const isValidPdf = await validatePdfHeader(req.file.path);
      if (!isValidPdf) {
        await fs.promises.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ message: "Invalid PDF file" });
      }

      const book = new Book({
        title,
        author,
        category: category || "General",
        description: description || "",
        coverUrl: coverUrl || "",
        pdfUrl: `/uploads/${req.file.filename}`,
        status: "published",
        rejectionReason: "",
        isPdfVerified: true,
      });

      await book.save();
      return res.status(201).json(book);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
});

router.post("/submissions/create", (req, res) => {
  const multiUpload = upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]);

  multiUpload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError.message });
    }

    try {
      const { title, author, category, description } = req.body;
      if (!title || !author) {
        return res.status(400).json({ message: "Title and author required" });
      }
      if (!req.files || !req.files.pdf) {
        return res.status(400).json({ message: "PDF required" });
      }

      const pdfFile = req.files.pdf[0];
      const isValidPdf = await validatePdfHeader(pdfFile.path);
      if (!isValidPdf) {
        await fs.promises.unlink(pdfFile.path).catch(() => {});
        return res.status(400).json({ message: "Uploaded file content is not a valid PDF" });
      }

      const coverPath = req.files.cover ? `/uploads/${req.files.cover[0].filename}` : "";

      const newSubmission = new Book({
        title,
        author,
        category: category || "General",
        description: description || "",
        pdfUrl: `/uploads/${pdfFile.filename}`,
        coverUrl: coverPath,
        status: "pending",
        rejectionReason: "",
        isPdfVerified: true,
      });

      await newSubmission.save();
      return res.status(201).json(newSubmission);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
});

router.get("/submissions", async (_req, res) => {
  try {
    const submissions = await Book.find({ status: "pending" });
    return res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', details: error.message });
  }
});


// GET single book by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMockDb) {
      const book = mockBooks.find(b => b.id === id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      return res.json(book);
    }

    if (!Book || !Book.findById) {
      return res.status(500).json({ message: 'Book model not available' });
    }

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', details: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/submissions/my-uploads", async (_req, res) => {
  try {
    const submissions = await Book.find({
      status: { $in: ["pending", "approved", "rejected"] },
    });
    return res.json(submissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const reviewSubmission = async (req, res) => {
  try {
    const { approved, rejectionReason } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (approved) {
      book.status = "approved";
      book.rejectionReason = "";
    } else {
      book.status = "rejected";
      book.rejectionReason = rejectionReason || "Rejected by admin";
    }

    await book.save();

    return res.json({
      message: approved ? "Approved" : "Rejected",
      book,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

router.post("/review/:id", reviewSubmission);
router.post("/submissions/review/:id", reviewSubmission);

router.get("/", async (_req, res) => {
  try {
    const books = await Book.find({
      $or: [
        { status: { $in: ["published", "approved"] } },
        { status: { $exists: false } },
      ],
    });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/submissions/:id", async (req, res) => {
  try {
    const submission = await Book.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    await Book.findByIdAndDelete(req.params.id);
    return res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

router.put("/:id", verifyToken, isAdmin, updateBook);
router.put("/update/:id", verifyToken, isAdmin, updateBook);

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', details: error.message });
  }
});


// DELETE by id (new route)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMockDb) {
      const index = mockBooks.findIndex((book) => book.id === id);
      if (index === -1) return res.status(404).json({ message: 'Book not found' });
      mockBooks.splice(index, 1);
      return res.json({ message: 'Book deleted successfully' });
    }

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', details: error.message });
  }
});

// PUT update by id (new route)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMockDb) {
      const index = mockBooks.findIndex((book) => book.id === id);
      if (index === -1) return res.status(404).json({ message: 'Book not found' });
      mockBooks[index] = { ...mockBooks[index], ...req.body };
      return res.json(mockBooks[index]);
    }

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book id' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', details: error.message });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

router.delete("/delete/:id", verifyToken, isAdmin, deleteBook);
router.delete("/:id", verifyToken, isAdmin, deleteBook);

module.exports = router;
