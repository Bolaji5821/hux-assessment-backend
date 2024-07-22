const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const contactRoutes = require('../routes/contactRoutes');
const { getDB, setDB } = require('../config/db');

let mongoServer;
let mongoClient;
let app;

jest.setTimeout(30000); // Increase overall test timeout

// Custom middleware for testing
const testAuthMiddleware = (req, res, next) => {
  req.user = { _id: '123456789012345678901234', email: 'test@example.com' };
  next();
};

beforeAll(async () => {
  // Set up MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();

  // Set the database for the application
  const db = mongoClient.db();
  setDB(db);

  // Create a new Express app for testing
  app = express();
  app.use(express.json());

  // Use the test auth middleware
  app.use(testAuthMiddleware);

  // Use the contact routes
  app.use('/api/contacts', contactRoutes);

  // Suppress console.log and console.error in tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
}, 30000);

afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Contact API', () => {
  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      const newContact = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'john@example.com',
        address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(newContact)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.firstName).toBe(newContact.firstName);
      expect(response.body.lastName).toBe(newContact.lastName);
      expect(response.body.phoneNumber).toBe(newContact.phoneNumber);
      expect(response.body.email).toBe(newContact.email);
      expect(response.body.address).toBe(newContact.address);
      expect(response.body.userId).toBe('test@example.com');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteContact = {
        firstName: 'Jane'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(incompleteContact)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/contacts/:id', () => {
    let contactId;

    beforeEach(async () => {
      // Create a contact to update
      const newContact = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        userId: 'test@example.com'
      };

      const db = getDB();
      const result = await db.collection('contacts').insertOne(newContact);
      contactId = result.insertedId.toString();
    });

    it('should update an existing contact', async () => {
      const updatedContact = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '9876543210',
        email: 'jane@example.com',
        address: '456 Elm St'
      };

      const response = await request(app)
        .put(`/api/contacts/${contactId}`)
        .send(updatedContact)
        .expect(200);

      expect(response.body.firstName).toBe(updatedContact.firstName);
      expect(response.body.lastName).toBe(updatedContact.lastName);
      expect(response.body.phoneNumber).toBe(updatedContact.phoneNumber);
      expect(response.body.email).toBe(updatedContact.email);
      expect(response.body.address).toBe(updatedContact.address);
    });

    it('should return 404 if contact is not found', async () => {
      const nonExistentId = new ObjectId();
      const updatedContact = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '9876543210',
        email: 'jane@example.com',
        address: '456 Elm St'
      };

      await request(app)
        .put(`/api/contacts/${nonExistentId}`)
        .send(updatedContact)
        .expect(404);
    });

    it('should return 401 if user is not authorized to update the contact', async () => {
      // Create a contact with a different userId
      const unauthorizedContact = {
        firstName: 'Unauthorized',
        lastName: 'User',
        phoneNumber: '1111111111',
        email: 'unauthorized@example.com',
        address: '789 Oak St',
        userId: 'different@example.com'
      };

      const db = getDB();
      const result = await db.collection('contacts').insertOne(unauthorizedContact);
      const unauthorizedContactId = result.insertedId.toString();

      const updatedContact = {
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '9876543210',
        email: 'jane@example.com',
        address: '456 Elm St'
      };

      await request(app)
        .put(`/api/contacts/${unauthorizedContactId}`)
        .send(updatedContact)
        .expect(401);
    });

    it('should return 400 if required fields are missing in update', async () => {
      const incompleteContact = {
        firstName: 'Jane'
      };

      await request(app)
        .put(`/api/contacts/${contactId}`)
        .send(incompleteContact)
        .expect(400);
    });
  });
});