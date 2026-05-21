const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;
    const resolvedName = name || fullName;

    if (!resolvedName || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name: resolvedName, fullName: resolvedName, email, password });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name || user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      userId: user._id.toString(),
      user: {
        id: user._id,
        name: user.name || user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/star-toggle", async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ message: "User ID and Book ID are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isStarred = user.starredBooks.some((id) => id.toString() === bookId);

    if (isStarred) {
      user.starredBooks = user.starredBooks.filter((id) => id.toString() !== bookId);
    } else {
      user.starredBooks.push(bookId);
    }

    await user.save();

    return res.status(200).json({
      message: "Favorites updated successfully",
      starredBooks: user.starredBooks,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error updating stars", error: err.message });
  }
});

router.get("/user-stars/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ starredBooks: user.starredBooks });
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching stars", error: err.message });
  }
});

module.exports = router;
