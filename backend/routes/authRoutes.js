const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Route for Registration: /api/auth/register
router.post('/register', register);

// Route for Login: /api/auth/login
router.post('/login', login);

module.exports = router;