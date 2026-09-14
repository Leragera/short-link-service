import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import app from '../app.js';
import { shortenUrlSchema } from '../utils/validators.js';

process.env.APP_URL = 'http://localhost:3001';

test('GET /api/health is handled by the health route', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'OK');
});

test('shortenUrlSchema rejects links pointing to this service', () => {
  const result = shortenUrlSchema.safeParse({
    originalUrl: 'http://localhost:3001/another-short-link',
  });

  assert.equal(result.success, false);
});
