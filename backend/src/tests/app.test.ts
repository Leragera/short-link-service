import request from 'supertest';
import { afterEach, describe, expect, jest, test } from '@jest/globals';
import app from '../app';
import redis from '../services/redis';
import { ShortLinkRepository } from '../repositories/shortLinkRepository';
import { shortenUrlSchema } from '../utils/validators';

jest.mock('../services/redis', () => ({
  __esModule: true,
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
    jest.clearAllMocks();
    process.env.APP_URL = 'http://localhost:3001';
  });

  test('POST /api/shorten returns 400 for an invalid URL', async () => {
    jest.spyOn(ShortLinkRepository, 'create');

    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'ftp://example.com/file' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Невалидный URL');
    expect(ShortLinkRepository.create).not.toHaveBeenCalled();
  });

  test('POST /api/shorten creates a short link', async () => {
    const createdShortLink = {
      id: 1,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: new Date('2026-09-14T12:00:00.000Z'),
    };
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue(null);
    jest.spyOn(ShortLinkRepository, 'create').mockResolvedValue(createdShortLink);

    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      shortCode: 'abc123',
      shortUrl: 'http://localhost:3001/abc123',
    });
    expect(ShortLinkRepository.findByCode).toHaveBeenCalledWith(expect.any(String));
    expect(ShortLinkRepository.create).toHaveBeenCalledWith(
      expect.any(String),
      'https://example.com',
    );
  });

  test('POST /api/shorten regenerates the code after a collision', async () => {
    const createdShortLink = {
      id: 1,
      shortCode: 'new123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: new Date('2026-09-14T12:00:00.000Z'),
    };
    const existingShortLink = {
      ...createdShortLink,
      shortCode: 'old123',
    };
    jest
      .spyOn(ShortLinkRepository, 'findByCode')
      .mockResolvedValueOnce(existingShortLink)
      .mockResolvedValueOnce(null);
    jest.spyOn(ShortLinkRepository, 'create').mockResolvedValue(createdShortLink);

    const response = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com' });

    expect(response.status).toBe(201);
    expect(response.body.shortCode).toBe('new123');
    expect(ShortLinkRepository.findByCode).toHaveBeenCalledTimes(2);
    expect(ShortLinkRepository.create).toHaveBeenCalledTimes(1);
  });

  test('GET /:shortCode redirects from the Redis cache', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue('https://example.com');
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue(null);
    jest.spyOn(ShortLinkRepository, 'incrementClicks').mockResolvedValue({
      id: 1,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 1,
      createdAt: new Date('2026-09-14T12:00:00.000Z'),
    });

    const response = await request(app).get('/abc123');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://example.com');
    expect(redis.get).toHaveBeenCalledWith('shortlink:abc123');
    expect(ShortLinkRepository.findByCode).not.toHaveBeenCalled();
    expect(ShortLinkRepository.incrementClicks).toHaveBeenCalledWith('abc123');
  });

  test('GET /:shortCode reads from the repository on a cache miss', async () => {
    const createdAt = new Date('2026-09-14T12:00:00.000Z');
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    jest.spyOn(redis, 'setex').mockResolvedValue('OK');
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue({
      id: 1,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt,
    });
    jest.spyOn(ShortLinkRepository, 'incrementClicks').mockResolvedValue({
      id: 1,
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clicks: 1,
      createdAt,
    });

    const response = await request(app).get('/abc123');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://example.com');
    expect(ShortLinkRepository.findByCode).toHaveBeenCalledWith('abc123');
    expect(redis.setex).toHaveBeenCalledWith('shortlink:abc123', 3600, 'https://example.com');
    expect(ShortLinkRepository.incrementClicks).toHaveBeenCalledWith('abc123');
  });

  test('GET /:shortCode returns 404 for an unknown short code', async () => {
    jest.spyOn(redis, 'get').mockResolvedValue(null);
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue(null);

    const response = await request(app).get('/missing1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Короткий код не найден' });
    expect(redis.setex).not.toHaveBeenCalled();
  });

  test('GET /api/stats/:shortCode returns link statistics', async () => {
    const createdAt = new Date('2026-09-14T12:00:00.000Z');
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue({
      id: 1,
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
    expect(ShortLinkRepository.findByCode).toHaveBeenCalledWith('abc123');
  });

  test('GET /api/stats/:shortCode returns 404 for an unknown short code', async () => {
    jest.spyOn(ShortLinkRepository, 'findByCode').mockResolvedValue(null);

    const response = await request(app).get('/api/stats/missing1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Короткий код не найден' });
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
