const request = require('supertest');
const express = require('express');
const axios = require('axios');

// Mock dependencies at the top
jest.mock('axios');
jest.mock('../src/models/item.model', () => ({
  create: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../src/utils/validation', () => jest.fn());
jest.mock('../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
const itemRoutes = require('../src/routes/item.routes');
itemRoutes(app);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

describe('Item Controller API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/items/create - createItem', () => {
    it('should create an item and return 201', async () => {
      const validateItem = require('../src/utils/validation');
      validateItem.mockReturnValue({ isValid: true });

      const mockItem = {
        _id: 'mocked-id',
        name: 'Test Item',
        quantity: 10,
        price: 100,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const Item = require('../src/models/item.model');
      Item.create.mockResolvedValue(mockItem);

      axios.post.mockResolvedValue({ status: 200, data: {} });

      const res = await request(app)
        .post('/api/v1/items/create')
        .send({ name: 'Test Item', quantity: 10, price: 100 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        status: 201,
        message: 'Item created successfully',
        result: mockItem,
      });
      expect(Item.create).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5101/api/v1/notifications/create',
        {
          itemId: 'mocked-id',
          type: 'item_created',
          message: 'New item created: Test Item',
          metadata: { name: 'Test Item', quantity: 10, price: 100 },
        }
      );
    });

    it('should return 400 if validation fails', async () => {
      const validateItem = require('../src/utils/validation');
      validateItem.mockReturnValue({
        isValid: false,
        error: { message: 'Validation error', details: ['Name is required'] },
      });

      const res = await request(app)
        .post('/api/v1/items/create')
        .send({ quantity: 10, price: 100 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: 'Validation error',
        details: ['Name is required'],
      });
    });
  });

  describe('GET /api/v1/items/get/:id - getItemById', () => {
    it('should fetch an item by ID and return 200', async () => {
      const mockItem = {
        _id: 'mocked-id',
        name: 'Test Item',
        quantity: 10,
        price: 100,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const Item = require('../src/models/item.model');
      Item.findById.mockResolvedValue(mockItem);

      const res = await request(app).get('/api/v1/items/get/mocked-id');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        status: 200,
        message: 'Item details fetched successfully',
        item: mockItem,
      });
      expect(Item.findById).toHaveBeenCalledWith('mocked-id');
    });

    it('should return 404 if item not found', async () => {
      const Item = require('../src/models/item.model');
      Item.findById.mockResolvedValue(null);

      const res = await request(app).get('/api/v1/items/get/nonexistent-id');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        status: 404,
        error: 'Item not found',
      });
      expect(Item.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});