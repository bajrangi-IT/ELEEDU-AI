const request = require('supertest');
const app = require('../index');

describe('API Integration Tests', () => {
  describe('GET /', () => {
    it('should return 200 and a running message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Election Assistant API is running');
    });
  });

  describe('GET /api/types', () => {
    it('should return election types', async () => {
      const res = await request(app).get('/api/types');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('POST /api/chat', () => {
    it('should return 400 for empty query', async () => {
      const res = await request(app).post('/api/chat').send({ query: '' });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 for long query', async () => {
      const longQuery = 'a'.repeat(501);
      const res = await request(app).post('/api/chat').send({ query: longQuery });
      expect(res.statusCode).toEqual(400);
    });

    it('should return mock response if API key is missing', async () => {
      const res = await request(app).post('/api/chat').send({ query: 'Hello' });
      if (res.statusCode !== 200) console.log('DEBUG 500 Error:', res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.response).toContain('received your question');
    });
  });

  describe('POST /api/check-eligibility', () => {
    it('should validate eligibility correctly', async () => {
      const res = await request(app)
        .post('/api/check-eligibility')
        .send({ age: 20, isCitizen: true, residencyPeriod: 12 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.isEligible).toBe(true);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app).post('/api/check-eligibility').send('invalid');
      expect(res.statusCode).toEqual(400);
    });
  });
});
