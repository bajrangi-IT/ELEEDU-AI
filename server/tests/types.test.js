const request = require('supertest');
const express = require('express');
const router = require('../routes/api');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Election Types API', () => {
  it('should return all 3 election categories', async () => {
    const res = await request(app).get('/api/types');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('frequency');
  });

  it('should include Lok Sabha in national elections', async () => {
    const res = await request(app).get('/api/types');
    const national = res.body.find(t => t.id === 'national');
    expect(national.name).toContain('Lok Sabha');
  });
});
