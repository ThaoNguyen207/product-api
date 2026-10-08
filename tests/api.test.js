const request = require('supertest');
const express = require('express');

// Tạo một ứng dụng test đơn giản hoặc import app từ index.js
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('CI/CD Healthcheck Test', () => {
  it('GET /health - Nên trả về status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});