const db = require('../config/db');

exports.uploadProperty = async (req, res) => {
    const {
        title,
        description,
        price,
        location, 
        property_type,
        bedrooms,
        bathrooms } = req.body;
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

exports.listProperties = async (req, res) => {
    const { location, price_min, price_max, property_type, bedrooms, bathrooms } = req.query;

    // Build the base query
    let query = "SELECT * FROM properties WHERE 1=1";
    const queryParams = [];

    // Add filters dynamically
    if (location) {
        query += " AND location LIKE ?";
        queryParams.push(`%${location}%`);
    }
    if (price_min) {
        query += " AND price >= ?";
        queryParams.push(price_min);
    }
    if (price_max) {
        query += " AND price <= ?";
        queryParams.push(price_max);
    }
    if (property_type) {
        query += " AND property_type = ?";
        queryParams.push(property_type);
    }
    if (bedrooms) {
        query += " AND bedrooms >= ?";
        queryParams.push(bedrooms);
    }
    if (bathrooms) {
        query += " AND bathrooms >= ?";
        queryParams.push(bathrooms);
    }

    try {
        // Execute the query
        const [rows] = await db.promise().query(query, queryParams);

        res.status(200).json({
            message: "Properties retrieved successfully.",
            properties: rows,
        });
    } catch (error) {
        console.error("Error retrieving properties:", error);
        res.status(500).json({ message: "An error occurred while fetching properties." });
    }
};
