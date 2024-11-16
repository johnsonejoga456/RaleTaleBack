const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = async (req, res) => {
    const { full_name, email, telephone, office_address, home_address, password, confirm_password } = req.body;

    // Password confirmation check
    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (result.length > 0) return res.status(400).json({ message: "Email already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into DB
        db.query('INSERT INTO users (full_name, email, telephone, office_address, home_address, password) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, email, telephone, office_address, home_address, hashedPassword],
            (err) => {
                if (err) return res.status(500).json({ message: "Server error" });
                res.status(201).json({ message: "User registered successfully" });
            });
    });
};


// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Query the database for the user
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = rows[0]; // Get the first user from the result

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, full_name: user.full_name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};
