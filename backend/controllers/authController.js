const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// LOGIC FOR REGISTRATION
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already registered with this email." });
        }

        // 2. Hash the password (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save to MongoDB
        user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ success: true, message: "User created successfully!" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error during registration");
    }
};

// LOGIC FOR LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Check if JWT_SECRET exists to prevent a crash
        if (!process.env.JWT_SECRET) {
            console.error("Error: JWT_SECRET is not defined in .env file");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        // Always return JSON, even on error
        res.status(500).json({ message: "Server Error during login" });
    }
};