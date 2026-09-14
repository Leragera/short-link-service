"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ioredis_1 = __importDefault(require("ioredis"));
// Создаём подключение к Redis
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
// Проверяем, что подключение работает
redis.on('connect', () => {
    console.log('Redis подключён');
});
redis.on('error', (err) => {
    console.error('Ошибка Redis:', err);
});
exports.default = redis;
