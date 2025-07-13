const mysql = require('mysql2/promise');

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'mihirgopani11',
      database: process.env.DB_NAME || 'zenn-ai',
      port: process.env.DB_PORT || 3306
    });

    console.log('MySQL Connected successfully');
    
    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) DEFAULT 'Demo User',
        country_code VARCHAR(10) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        otp VARCHAR(6),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_phone (country_code, phone)
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('Users table ready');
    
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 