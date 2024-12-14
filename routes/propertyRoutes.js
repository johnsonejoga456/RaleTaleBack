const express = require("express");
const db = require("../config/db");
const { uploadProperty } = require('../controllers/propertyController');
const {authenticate } = require('../middleware/propertyMiddleware');
const router = express.Router();

router.post('/properties', authenticate, uploadProperty);

module.exports = router