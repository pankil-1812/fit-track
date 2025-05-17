# Fitness Routine Application - Backend

This is the backend API for the Fitness Routine Application. It provides a robust RESTful API for managing user fitness routines, workout logs, stretch sequences, challenges, and social interactions.

## Tech Stack

- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication with HTTP-only cookies
- Testing with Jest & Supertest

## Features

- User management with comprehensive profile data
- Workout routine builder with exercise tracking
- Interactive stretch sequence management
- Workout logging and tracking
- Health analytics and progress monitoring
- Social interactions (posts, challenges, achievements)
- Two-factor authentication
- Comprehensive API with validation and error handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd Health-Tracker-App/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following content:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fitness-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=7
   ```

4. Start development server
   ```
   npm run dev
   ```

5. Build for production
   ```
   npm run build
   ```

6. Run production server
   ```
   npm start
   ```

### Testing

Run tests with:
```
npm test
```

## API Documentation

The API is organized around REST principles. All endpoints return JSON data and use standard HTTP response codes.

### Base URL

`/api/v1`

### Authentication Endpoints

- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/verify-2fa` - Verify 2FA code
- `GET /users/logout` - User logout
- `POST /users/forgot-password` - Request password reset
- `PUT /users/reset-password/:resetToken` - Reset password
- `POST /users/refresh-token` - Refresh JWT token

### User Endpoints

- `GET /users/me` - Get current user profile
- `PUT /users/update-details` - Update user details
- `PUT /users/update-password` - Update password
- `PUT /users/privacy` - Update privacy settings
- `PUT /users/profile-picture` - Upload profile picture
- `GET /users/search` - Search users

### Routine Endpoints

- `GET /routines` - Get all accessible routines
- `POST /routines` - Create new routine
- `GET /routines/:id` - Get specific routine
- `PUT /routines/:id` - Update routine
- `DELETE /routines/:id` - Delete routine
- `PUT /routines/:id/like` - Like/unlike routine
- `PUT /routines/:id/save` - Save routine
- `GET /routines/search` - Search routines

### Workout Log Endpoints

- `GET /workouts` - Get user's workout logs
- `POST /workouts` - Create new workout log
- `GET /workouts/:id` - Get specific workout
- `PUT /workouts/:id` - Update workout log
- `DELETE /workouts/:id` - Delete workout log
- `GET /workouts/stats` - Get workout statistics

### Analytics Endpoints

- `GET /analytics/overview` - Get user analytics overview
- `GET /analytics/daily` - Get daily statistics
- `GET /analytics/body-measurements` - Get body measurements
- `POST /analytics/body-measurements` - Add new body measurement
- `GET /analytics/fitness-scores` - Get fitness scores
- `POST /analytics/fitness-scores` - Add new fitness score
- `GET /analytics/achievements` - Get achievements
- `POST /analytics/achievements` - Add new achievement
- `POST /analytics/rebuild` - Rebuild user analytics

## Project Structure

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middlewares/   # Express middlewares
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── tests/         # Test files
│   └── server.ts      # Entry point
├── .env               # Environment variables
├── .env.test          # Test environment variables
├── tsconfig.json      # TypeScript configuration
├── jest.config.js     # Jest configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "status": "error",
  "message": "Error message here"
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## Security Features

- Password hashing with bcrypt
- JWT authentication with refresh tokens
- HTTP-only cookies
- Two-factor authentication
- Password reset functionality
- CORS configuration
- Input validation
- Rate limiting (implementation in progress)
