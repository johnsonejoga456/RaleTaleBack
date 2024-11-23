const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// View user profile
router.get("/profile", authMiddleware, userController.getProfile);


// Update user profile  
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
