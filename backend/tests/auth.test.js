const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection URI for testing

describe('Auth API', () => {
  let userId;
  const userPayload = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  // Clean up database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    User.deleteMany({});
    await mongoose.disconnect();
  });

  // Testing user registration
  describe('POST /auth/signup', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send(userPayload)
        .expect('Content-Type', /json/)
        .expect(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', userPayload.username);
      expect(response.body.user).toHaveProperty('email', userPayload.email);
      userId = response.body.user._id;
    });
    
    test('should fail to register a user with missing fields', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'testuser' }) // Missing email and password
        .expect('Content-Type', /json/)
        .expect(400);
        
       
      expect(response.body).toHaveProperty('message', 'Please add all the fields');
    });
    
    test('should fail to register a user with an existing email', async () => {
      await request(app).post('/auth/signup').send(userPayload);
      
      const response = await request(app)
        .post('/auth/signup')
        .send(userPayload) // Trying to register with the same email
        .expect('Content-Type', /json/)
        .expect(409);
        
       
      expect(response.body).toHaveProperty('message', 'Email already exists');
    });
    
    test('should fail to register a user with an existing username', async () => {
      await request(app).post('/auth/signup').send(userPayload);
      
      const response = await request(app)
        .post('/auth/signup')
        .send({ ...userPayload, email: 'newemail@example.com' }) // Different email but same username
        .expect('Content-Type', /json/)
        .expect(409);
        
       
      expect(response.body).toHaveProperty('message', 'Username already exists');
    });
  });

  // Test user login
  describe('POST /auth/login', () => {
    test('should log in a user successfully', async () => {
      await request(app).post('/auth/signup').send(userPayload);
      
      const response = await request(app)
        .post('/auth/login')
        .send({ email: userPayload.email, password: userPayload.password })
        .expect('Content-Type', /json/)
        .expect(200);
        
       
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', userPayload.username);
      expect(response.body.user).toHaveProperty('email', userPayload.email);
    });
    
    test('should fail to log in with missing fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: userPayload.email }) // Missing password
        .expect('Content-Type', /json/)
        .expect(400);
        
       
      expect(response.body).toHaveProperty('message', 'Please add all the fields');
    });
    
    test('should fail to log in with invalid credentials', async () => {
      await request(app).post('/auth/signup').send(userPayload);
      
      const response = await request(app)
        .post('/auth/login')
        .send({ email: userPayload.email, password: 'wrongpassword' })
        .expect('Content-Type', /json/)
        .expect(401);
        
       
      expect(response.body).toHaveProperty('message', 'Invalid password');
    });
    
    test('should fail to log in with non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(404);
        
       
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
