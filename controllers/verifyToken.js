const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Token is valid:", decoded);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
    //   console.log("Token has expired");
      return { valid: false, expired: true };
    } else {
    //   console.log("Invalid token");
      return { valid: false, expired: false };
    }
  }
};

module.exports = verifyToken
