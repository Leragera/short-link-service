import dotenv from 'dotenv';
dotenv.config();

import Redis from 'ioredis';

// Создаём подключение к Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Проверяем, что подключение работает
redis.on('connect', () => {
  console.log('Redis подключён');
});

redis.on('error', (err) => {
  console.error('Ошибка Redis:', err);
});

export default redis;