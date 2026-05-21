const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User'); // Required to run database queries here

// Route for Registration: /api/auth/register
router.post('/register', register);

// Route for Login: /api/auth/login
router.post('/login', login);

// --- ADDED: Starred Books Pipeline ---

/**
 * POST /api/auth/star-toggle
 * Adds or removes a book ID from the user's starredBooks array
 */
router.post('/star-toggle', async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ message: 'User ID and Book ID are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the book is already inside the array
    const isStarred = user.starredBooks.includes(bookId);

    if (isStarred) {
      // Pull out / remove from list
      user.starredBooks = user.starredBooks.filter(id => id.toString() !== bookId);
    } else {
      // Push in / add to list
      user.starredBooks.push(bookId);
    }

    await user.save();
    
    // Send updated list back to user dashboard UI
    res.status(200).json({ 
      message: 'Favorites updated successfully', 
      starredBooks: user.starredBooks 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating stars', error: err.message });
  }
});

/**
 * GET /api/auth/user-stars/:userId
 * Fetches the user's array of starred book IDs on application dashboard load
 */
router.get('/user-stars/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    res.status(200).json({ starredBooks: user.starredBooks });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching stars', error: err.message });
  }
});

module.exports = router;