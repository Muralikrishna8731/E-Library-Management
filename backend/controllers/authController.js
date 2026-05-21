const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// ==========================================
// LOGIC FOR REGISTRATION
// ==========================================
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
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: "Server Error during registration" });
    }
};

// ==========================================
// LOGIC FOR LOGIN
// ==========================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 2. Verify Password Match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 3. Environment Check
        if (!process.env.JWT_SECRET) {
            console.error("Error: JWT_SECRET is not defined in .env file");
            return res.status(500).json({ message: "Server configuration error" });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: user._id, name: user.fullName },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5. EXACT MATCH: Send userId at the top level AND name inside user object
        res.json({
            token,
            userId: user._id.toString(), // 👈 FIX: Matches localStorage.setItem('userId', data.userId)
            user: {
                name: user.fullName,    // 👈 FIX: Matches localStorage.setItem('userName', data.user.name)
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server Error during login" });
    }
};