import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load env vars
dotenv.config({ path: './.env.test' });

// Setup global test variables
beforeAll(async () => {
  // Use test database
  process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitness-tracker-test';
  
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
});

// Clear database after tests
afterAll(async () => {
  // Clean up database
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.dropDatabase();
  }
  
  // Close connection
  await mongoose.connection.close();
});
