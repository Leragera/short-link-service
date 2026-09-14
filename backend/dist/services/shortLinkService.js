"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkService = void 0;
const redis_1 = __importDefault(require("./redis"));
const generateCode_1 = require("../utils/generateCode");
const shortLinkRepository_1 = require("../repositories/shortLinkRepository");
class ShortLinkService {
    // Создать короткую ссылку
    static async create(input) {
        // Генерируем уникальный код
        let shortCode;
        let isUnique = false;
        while (!isUnique) {
            shortCode = (0, generateCode_1.generateShortCode)(6);
            const existing = await shortLinkRepository_1.ShortLinkRepository.findByCode(shortCode);
            if (!existing) {
                isUnique = true;
            }
        }
        // Создаём запись в БД
        const shortLink = await shortLinkRepository_1.ShortLinkRepository.create(shortCode, input.originalUrl);
        const appUrl = process.env.APP_URL?.replace(/\/$/, '');
        if (!appUrl) {
            throw new Error('APP_URL не задан');
        }
        const shortUrl = `${appUrl}/${shortLink.shortCode}`;
        return {
            shortCode: shortLink.shortCode,
            shortUrl,
        };
    }
    // Получить статистику
    static async getStats(shortCode) {
        const shortLink = await shortLinkRepository_1.ShortLinkRepository.findByCode(shortCode);
        if (!shortLink) {
            return null;
        }
        return {
            originalUrl: shortLink.originalUrl,
            shortCode: shortLink.shortCode,
            clicks: shortLink.clicks,
            createdAt: shortLink.createdAt,
        };
    }
    // Обработать редирект
    static async handleRedirect(shortCode) {
        let cachedUrl = null;
        // Пытаемся получить из Redis, но не ломаем приложение, если он упал
        try {
            cachedUrl = await redis_1.default.get(`shortlink:${shortCode}`);
        }
        catch (redisError) {
            console.warn('Redis недоступен, переходим к PostgreSQL:', redisError);
        }
        if (cachedUrl) {
            await shortLinkRepository_1.ShortLinkRepository.incrementClicks(shortCode);
            return cachedUrl;
        }
        // Если в кэше нет (или Redis упал), идем в БД
        const shortLink = await shortLinkRepository_1.ShortLinkRepository.findByCode(shortCode);
        if (!shortLink) {
            return null;
        }
        // Пытаемся сохранить в кэш, но игнорируем ошибки, если Redis недоступен
        try {
            await redis_1.default.setex(`shortlink:${shortCode}`, 3600, shortLink.originalUrl);
        }
        catch (redisError) {
            console.warn('Не удалось сохранить в Redis:', redisError);
        }
        await shortLinkRepository_1.ShortLinkRepository.incrementClicks(shortCode);
        return shortLink.originalUrl;
    }
}
exports.ShortLinkService = ShortLinkService;
