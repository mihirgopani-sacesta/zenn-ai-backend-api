# Zenn AI Backend API

A simple Node.js backend API for phone-based authentication using OTP verification via Twilio.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp env.example .env

# Edit .env file with your actual values
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=zenn-ai
DB_PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Create the MySQL database:
```sql
CREATE DATABASE zenn_ai;
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Login with Phone Number
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "country_code": "+91",
    "phone": "9876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "user_id": 1,
    "otp": "123456",
    "expires_in": 300,
    "sms_result": {
      "success": true,
      "message": "OTP sent successfully via Twilio"
    }
  }
  ```

#### Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body:**
  ```json
  {
    "user_id": 1,
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "Demo User",
      "country_code": "+91",
      "phone": "9876543210",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
  ```

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "Demo User",
      "country_code": "+91",
      "phone": "9876543210",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

## Project Structure

```
├── config/
│   └── database.js          # MySQL database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   └── User.js             # User model with MySQL operations
├── routes/
│   └── authRoutes.js       # Authentication routes
├── services/
│   └── otpService.js       # OTP generation and sending service (Twilio)
├── index.js                # Main server file
├── package.json
├── env.example             # Environment variables template
└── README.md
```

## Database Schema

The application automatically creates the `users` table with the following structure:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT 'Demo User',
  country_code VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6),
  otp_expires_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_phone (country_code, phone)
);
```

## Authentication Flow

1. **Login Request**: User sends phone number and country code
2. **User Creation**: If new user, creates entry with "Demo User" name
3. **OTP Generation**: Generates 6-digit OTP and saves to database
4. **OTP Sending**: Sends OTP via Twilio
5. **OTP Verification**: User sends OTP for verification
6. **Token Generation**: Upon successful verification, generates JWT token

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | mihirgopani11 |
| `DB_NAME` | MySQL database name | zenn-ai |
| `DB_PORT` | MySQL port | 8080 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | (required) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | (required) |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | (required) |

## Technologies Used

- **Express.js** - Web framework
- **MySQL** - Database
- **Twilio** - SMS OTP 