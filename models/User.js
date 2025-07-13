const mysql = require('mysql2/promise');

class User {
  static async createOrFind(connection, userData) {
    try {
      const { country_code, phone } = userData;
      
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT * FROM users WHERE country_code = ? AND phone = ?',
        [country_code, phone]
      );
      
      if (existingUsers.length > 0) {
        return existingUsers[0];
      }
      
      // Create new user
      const query = `
        INSERT INTO users (country_code, phone, Name) 
        VALUES (?, ?, 'Demo User')
      `;
      
      const [result] = await connection.execute(query, [country_code, phone]);
      
      // Get the created user
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      
      return users[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByPhone(connection, country_code, phone) {
    try {
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE country_code = ? AND phone = ?',
        [country_code, phone]
      );
      
      return users[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(connection, id) {
    try {
      const [users] = await connection.execute(
        'SELECT id, Name as name, country_code, phone, is_active, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      
      return users[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateOTP(connection, userId, otp) {
    try {
      const query = `
        UPDATE users 
        SET otp = ? 
        WHERE id = ?
      `;
      
      await connection.execute(query, [otp, userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOTP(connection, userId, otp) {
    try {
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ? AND otp = ?',
        [userId, otp]
      );
      
      if (users.length === 0) {
        return false;
      }
      
      // Mark user as active and clear OTP
      await connection.execute(
        'UPDATE users SET is_active = 1, otp = NULL WHERE id = ?',
        [userId]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 