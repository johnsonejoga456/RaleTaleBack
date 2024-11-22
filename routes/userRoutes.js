
const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/verifyUserToken", verifyToken);

const userController = require("../controllers/userController");
const authMiddleware = require("..middleware/authMiddleware");


// View user profile
router.get("/profile, authMiddleware, userController.getProfile");

// Update user profile
router.put("/profile", authMiddleware, userController.upateProfile);


module.exports = router;