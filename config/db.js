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

    // Create the users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telephone VARCHAR(15),
        office_address VARCHAR(255),
        home_address VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create the properties table if it doesn't exist
    const createPropertiesTable = `
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        property_type ENUM('apartment', 'house', 'land', 'commercial') NOT NULL,
        bedrooms INT DEFAULT 0,
        bathrooms INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    

    // Create Users Table
    connection.query(createUsersTable, (err) => {
      if (err) {
        console.error("Failed to create users table:", err.message);
      } else {
        console.log("Users table is ready.");
      }

      // Properties table
      connection.query(createPropertiesTable, (err) => {
        if (err) {
          console.error("Failed to create properties table:", err.message);
        } else {
          console.log("properties table is ready.");
        }
      })
      connection.release(); // Release the connection back to the pool
    });
  }
});

module.exports = db;
