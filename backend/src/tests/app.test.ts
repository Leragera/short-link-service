import request from 'supertest';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import app from '../app';
import { ShortLinkService } from '../services/shortLinkService';
import { shortenUrlSchema } from '../utils/validators';

jest.mock('../services/redis', () => ({
  default: {
    get: jest.fn(),
    setex: jest.fn(),
  },
}));

process.env.APP_URL = 'http://localhost:3001';
process.env.NODE_ENV = 'test';

describe('short link API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    process.env.APP_URL = 'http://localhost:3001';
  });

  test('POST /api/shorten creates a short link', async () => {
    jest.spyOn(ShortLinkService, 'create').mockResolvedValue({
      shortCode: 'abc123',
      shortUrl: 'http://localhost:3001/abc123',
    });

    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      shortCode: 'abc123',
      shortUrl: 'http://localhost:3001/abc123',
    });
  });

  test('GET /:shortCode redirects to the original URL', async () => {
    jest.spyOn(ShortLinkService, 'handleRedirect').mockResolvedValue('https://example.com');

    const response = await request(app).get('/abc123');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://example.com');
  });

  test('GET /api/stats/:shortCode returns link statistics', async () => {
    const createdAt = new Date('2026-09-14T12:00:00.000Z');
    jest.spyOn(ShortLinkService, 'getStats').mockResolvedValue({
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      clicks: 1,
      createdAt,
    });

    const response = await request(app).get('/api/stats/abc123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      clicks: 1,
      createdAt: createdAt.toISOString(),
    });
  });

  test('GET /api/health is handled by the health route', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('shortenUrlSchema rejects links pointing to this service', () => {
    const result = shortenUrlSchema.safeParse({
      originalUrl: 'http://localhost:3001/another-short-link',
    });

    expect(result.success).toBe(false);
  });

  test('shortenUrlSchema tolerates an invalid APP_URL configuration', () => {
    process.env.APP_URL = 'invalid-url';

    const result = shortenUrlSchema.safeParse({
      originalUrl: 'https://example.com',
    });

    expect(result.success).toBe(true);
  });
});
