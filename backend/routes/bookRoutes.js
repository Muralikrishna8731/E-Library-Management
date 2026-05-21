const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");

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
      if (file.mimetype === "application/pdf" || ext === ".pdf") {
        return cb(null, true);
      }
      return cb(new Error("Only PDF files are allowed"));
    }

    if (file.fieldname === "cover") {
      if (file.mimetype.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        return cb(null, true);
      }
      return cb(new Error("Only image files are allowed"));
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

router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { title, author, category, description, coverUrl } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "PDF file is required" });
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
  }
);

router.post(
  "/submissions/create",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, author, category, description } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
      }
      if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
        return res.status(400).json({ message: "PDF file is required" });
      }

      const pdfFile = req.files.pdf[0];
      const isValidPdf = await validatePdfHeader(pdfFile.path);
      if (!isValidPdf) {
        await fs.promises.unlink(pdfFile.path).catch(() => {});
        return res.status(400).json({ message: "Uploaded file content is not a valid PDF" });
      }

      const coverFile = req.files.cover?.[0];
      const coverPath = coverFile ? `/uploads/${coverFile.filename}` : "";

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
  }
);

router.get("/submissions", async (_req, res) => {
  try {
    const submissions = await Book.find({ status: "pending" });
    return res.json(submissions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch submissions", details: error.message });
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

router.post("/review/:id", verifyToken, isAdmin, reviewSubmission);
router.post("/submissions/review/:id", verifyToken, isAdmin, reviewSubmission);

router.get("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid submission id" });
    }
    const submission = await Book.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    return res.json(submission);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid submission id" });
    }
    const submission = await Book.findByIdAndDelete(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    return res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
