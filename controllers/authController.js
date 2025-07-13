const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTPService = require('../services/otpService');
const connectDB = require('../config/database');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Test OTPless configuration
const testOTPless = async (req, res) => {
  try {
    const testResult = await OTPService.testOTPlessConnection();
    
    res.json({
      success: true,
      message: 'OTPless test completed',
      result: testResult
    });
  } catch (error) {
    console.error('OTPless test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTPless test'
    });
  }
};

// Test SMS sending
const testSMS = async (req, res) => {
  try {
    const { country_code, phone } = req.body;
    
    if (!country_code || !phone) {
      return res.status(400).json({
        success: false,
        message: 'country_code and phone are required'
      });
    }

    // Static OTP for testing
    const otp = "7898";
    console.log(`[STATIC OTP] OTP ${otp} for ${country_code}${phone}`);

    res.json({
      success: true,
      message: 'SMS test completed',
      otp: otp,
      sms_result: {
        success: true,
        message: 'Static OTP sent for testing',
        static_mode: true
      }
    });
  } catch (error) {
    console.error('SMS test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during SMS test'
    });
  }
};

// Login with phone number and send OTP
const login = async (req, res) => {
  try {
    console.log('reached with', req.body);
    
    // Handle both naming conventions
    const country_code = req.body.country_code || req.body.countryCode;
    const phone = req.body.phone || req.body.phoneNumber;
    
    if (!country_code || !phone) {
      return res.status(400).json({
        success: false,
        message: 'country_code/countryCode and phone/phoneNumber are required'
      });
    }
    
    const connection = await connectDB();

    // Create or find user
    const user = await User.createOrFind(connection, { country_code, phone });

    // Static OTP for testing
    const otp = "7898";

    // Save OTP to database
    await User.updateOTP(connection, user.id, otp);

    // Comment out OTPless SMS sending
    // const smsResult = await OTPService.sendOTP(phone, country_code, otp);
    console.log(`[STATIC OTP] OTP ${otp} for ${country_code}${phone}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      user_id: user.id,
      otp: otp, // Static OTP for testing
      expires_in: 300, // 5 minutes in seconds
      sms_result: {
        success: true,
        message: 'Static OTP sent for testing',
        static_mode: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Verify OTP and complete login
const verifyOTP = async (req, res) => {
  try {
    const { user_id, otp } = req.body;
    const connection = await connectDB();

    // Verify OTP
    const isOTPValid = await User.verifyOTP(connection, user_id, otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Get user details
    const user = await User.findById(connection, user_id);

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const connection = await connectDB();
    const user = await User.findById(connection, req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

module.exports = {
  testOTPless,
  testSMS,
  login,
  verifyOTP,
  getProfile
}; 