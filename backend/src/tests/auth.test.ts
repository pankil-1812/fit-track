import request from 'supertest';
import server from '../server';
import { User } from '../models/userModel';

describe('Auth Controller', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  // Clean up after tests
  afterAll(async () => {
    await User.deleteMany({});
    server.close();
  });
  
  // Test user registration
  describe('POST /api/v1/users/register', () => {
    it('should register a new user and return a token', async () => {
      const res = await request(server)
        .post('/api/v1/users/register')
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.success).toBe(true);
    });
    
    it('should not register a user with an existing email', async () => {
      const res = await request(server)
        .post('/api/v1/users/register')
        .send(testUser);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  
  // Test user login
  describe('POST /api/v1/users/login', () => {
    it('should login a user and return a token', async () => {
      const res = await request(server)
        .post('/api/v1/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.success).toBe(true);
    });
    
    it('should not login with invalid credentials', async () => {
      const res = await request(server)
        .post('/api/v1/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
