const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Test routes for OTPless
router.get('/test-otpless', authController.testOTPless);
router.post('/test-sms', authController.testSMS);

// Phone-based authentication routes
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.get('/profile', auth, authController.getProfile);

module.exports = router; 