const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// View user profile
router.get("/profile", authMiddleware, userController.getProfile);

// ,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMyMjk2MDcyLCJleHAiOjE3MzIyOTk2NzJ9.9ho0E7JX4PljCDNdMIUfoRdHZx6dGPkPmY7mEaqaUbY"

// Update user profile  
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
