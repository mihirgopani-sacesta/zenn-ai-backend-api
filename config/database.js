const mysql = require('mysql2/promise');

const connectDB = async () => {
  console.log('MySQL Connection start');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'mihirgopani11',
      database: process.env.DB_NAME || 'zenn-ai',
      port: process.env.DB_PORT || 8080
    });

    console.log('MySQL Connected successfully');
    
   
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 