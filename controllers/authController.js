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
