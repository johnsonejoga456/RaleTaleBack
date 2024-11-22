const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Attach user ID to the request object
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
