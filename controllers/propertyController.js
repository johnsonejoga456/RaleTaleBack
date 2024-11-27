const db = require('../config/db');

exports.uploadProperty = async (req, res) => {
    const { title, description, price, location, property_type, bedrooms, bathrooms } = req.body;
    const userId = req.user.id; // Auth middleware sets req.user

    // Validate required fields
    if (!title || !price || !location || !property_type) {
        return res.status(400).json({ message: "Title, price, location, and property type are required." });
    }

    try {
        // Insert the property into the database
        const query = `
            INSERT INTO properties (user_id, title, description, price, location, property_type, bedrooms, bathrooms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(query, [userId, title, description, price, location, property_type, bedrooms, bathrooms]);
        
        return res.status(201).json({ message: "Property uploaded successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};
