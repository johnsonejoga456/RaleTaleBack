const db = require("../config/db");

// Get User Profile
exports.getProfile = async (req, res) => {
    const userId = req.user.id; // Extracted from the JWT token by authMiddleware

    try {
        const [rows] = await db.promise().query(
            "SELECT full_name, email, telephone, office_address, home_address FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user: rows[0],
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    const userId = req.user.id; // Extracted from the JWT token by authMiddleware
    const { full_name, email, telephone, office_address, home_address } = req.body;

    try {
        const [result] = await db.promise().query(
            "UPDATE users SET full_name = ?, email = ?, telephone = ?, office_address = ?, home_address = ? WHERE id = ?",
            [full_name, email, telephone, office_address, home_address, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);

        // Handle potential email uniqueness conflict
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already in use" });
        }

        res.status(500).json({ message: "Server error" });
    }
};
