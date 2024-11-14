const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  user: process.env.USERT,
  host: process.env.DB_HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the database successfully.");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
