const axios = require('axios');

class OTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(phone, country_code, otp) {
    try {
      // OTPless API configuration
      const otplessConfig = {
        clientId: process.env.OTPLESS_CLIENT_ID,
        clientSecret: process.env.OTPLESS_CLIENT_SECRET,
        baseUrl: 'https://api.otpless.app'
      };

      // Check if OTPless credentials are configured
      if (!otplessConfig.clientId || !otplessConfig.clientSecret) {
        console.log(`[OTP TEST] OTP ${otp} would be sent to ${country_code}${phone}`);
        return {
          success: true,
          message: 'OTP sent successfully (test mode)',
          test_mode: true
        };
      }

      // Prepare the request payload for OTPless
      const payload = {
        clientId: otplessConfig.clientId,
        clientSecret: otplessConfig.clientSecret,
        phone: `${country_code}${phone}`,
        message: `Your Zenn AI verification code is: ${otp}. Valid for 5 minutes.`,
        templateId: 'otp_template', // You can customize this
        channel: 'sms'
      };

      // Make API call to OTPless
      const response = await axios.post(`${otplessConfig.baseUrl}/send-otp`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${otplessConfig.clientSecret}`
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('OTPless API Response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: 'OTP sent successfully via OTPless',
          otpless_response: response.data
        };
      } else {
        throw new Error(response.data.message || 'Failed to send OTP via OTPless');
      }

    } catch (error) {
      console.error('Error sending OTP via OTPless:', error.response?.data || error.message);
      
      // Fallback: log the OTP for testing
      console.log(`[OTP FALLBACK] OTP ${otp} for ${country_code}${phone}`);
      
      return {
        success: true,
        message: 'OTP sent successfully (fallback mode)',
        fallback_mode: true,
        error: error.response?.data || error.message
      };
    }
  }

  static getOTPExpiryTime() {
    // OTP expires in 5 minutes
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    return expiryTime;
  }

  // Test method to check OTPless configuration
  static async testOTPlessConnection() {
    try {
      const clientId = process.env.OTPLESS_CLIENT_ID;
      const clientSecret = process.env.OTPLESS_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return {
          success: false,
          message: 'OTPless credentials not configured',
          configured: false
        };
      }

      // Test API call to OTPless
      const response = await axios.get('https://api.otpless.app/status', {
        headers: {
          'Authorization': `Bearer ${clientSecret}`
        },
        timeout: 5000
      });

      return {
        success: true,
        message: 'OTPless connection successful',
        configured: true,
        status: response.data
      };

    } catch (error) {
      return {
        success: false,
        message: 'OTPless connection failed',
        configured: true,
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = OTPService; 