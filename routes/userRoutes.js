const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// View user profile
router.get("/profile", authMiddleware, userController.getProfile);

// Update user profile
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;