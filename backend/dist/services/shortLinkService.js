"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkService = void 0;
const client_1 = require("../prisma/client");
const redis_1 = __importDefault(require("./redis"));
const generateCode_1 = require("../utils/generateCode");
class ShortLinkService {
    // Создать короткую ссылку
    static async create(input) {
        // Генерируем уникальный код
        let shortCode;
        let isUnique = false;
        while (!isUnique) {
            shortCode = (0, generateCode_1.generateShortCode)(6);
            const existing = await client_1.prisma.shortLink.findUnique({
                where: { shortCode },
            });
            if (!existing) {
                isUnique = true;
            }
        }
        // Создаём запись в БД
        const shortLink = await client_1.prisma.shortLink.create({
            data: {
                shortCode: shortCode,
                originalUrl: input.originalUrl,
                clicks: 0,
            },
        });
        const shortUrl = `http://localhost:3001/${shortLink.shortCode}`;
        return {
            shortCode: shortLink.shortCode,
            shortUrl,
        };
    }
    // Получить статистику
    static async getStats(shortCode) {
        const shortLink = await client_1.prisma.shortLink.findUnique({
            where: { shortCode },
        });
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
        // Проверяем кэш Redis
        const cachedUrl = await redis_1.default.get(`shortlink:${shortCode}`);
        if (cachedUrl) {
            // Увеличиваем счётчик в фоне
            client_1.prisma.shortLink.update({
                where: { shortCode },
                data: { clicks: { increment: 1 } },
            }).catch(err => console.error('Ошибка обновления clicks:', err));
            return cachedUrl;
        }
        // Ищем в БД
        const shortLink = await client_1.prisma.shortLink.findUnique({
            where: { shortCode },
        });
        if (!shortLink) {
            return null;
        }
        // Сохраняем в кэш на 1 час
        await redis_1.default.setex(`shortlink:${shortCode}`, 3600, shortLink.originalUrl);
        // Увеличиваем счётчик
        await client_1.prisma.shortLink.update({
            where: { shortCode },
            data: { clicks: { increment: 1 } },
        });
        return shortLink.originalUrl;
    }
}
exports.ShortLinkService = ShortLinkService;
