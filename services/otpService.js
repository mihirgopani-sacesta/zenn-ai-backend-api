const twilio = require('twilio');

class OTPService {
  static generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async sendOTP(phone, country_code, otp) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      // Fallback: log the OTP for testing
      console.log(`[OTP TEST] OTP ${otp} would be sent to ${country_code}${phone}`);
      return {
        success: true,
        message: 'OTP sent successfully (test mode)',
        test_mode: true
      };
    }

    const client = twilio(accountSid, authToken);
    try {
      const message = await client.messages.create({
        body: `Your Zenn AI verification code is: ${otp}. Valid for 5 minutes.`,
        from: fromNumber,
        to: `${country_code}${phone}`
      });
      return {
        success: true,
        message: 'OTP sent successfully via Twilio',
        twilio_response: message
      };
    } catch (error) {
      console.error('Error sending OTP via Twilio:', error.message);
      return {
        success: false,
        message: 'Failed to send OTP via Twilio',
        error: error.message
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