import dotenv from 'dotenv';
dotenv.config();

import Redis from 'ioredis';

const redis =
  process.env.NODE_ENV === 'test'
    ? new Redis({ lazyConnect: true, maxRetriesPerRequest: 0 })
    : new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Проверяем, что подключение работает
redis.on('connect', () => {
  console.log('Redis подключён');
});

redis.on('error', (err) => {
  console.error('Ошибка Redis:', err);
});

export default redis;