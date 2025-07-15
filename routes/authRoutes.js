const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Phone-based authentication routes
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.get('/profile', auth, authController.getProfile);

module.exports = router; 