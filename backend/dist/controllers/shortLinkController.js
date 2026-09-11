"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkController = void 0;
const shortLinkService_1 = require("../services/shortLinkService");
const validators_1 = require("../utils/validators");
class ShortLinkController {
    // POST /api/shorten
    static async create(req, res) {
        try {
            // Валидация
            const validationResult = validators_1.shortenUrlSchema.safeParse(req.body);
            if (!validationResult.success) {
                res.status(400).json({
                    error: 'Невалидный URL',
                    details: validationResult.error.issues,
                });
                return;
            }
            // Вызываем сервис
            const result = await shortLinkService_1.ShortLinkService.create(validationResult.data);
            res.status(201).json(result);
        }
        catch (error) {
            console.error('Ошибка при создании ссылки:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    // GET /:shortCode
    static async redirect(req, res) {
        try {
            // Явно указываем тип string
            const shortCode = req.params.shortCode;
            const originalUrl = await shortLinkService_1.ShortLinkService.handleRedirect(shortCode);
            if (!originalUrl) {
                res.status(404).json({ error: 'Короткий код не найден' });
                return;
            }
            res.redirect(302, originalUrl);
        }
        catch (error) {
            console.error('Ошибка при редиректе:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
    // GET /api/stats/:shortCode
    static async getStats(req, res) {
        try {
            // Явно указываем тип string
            const shortCode = req.params.shortCode;
            const stats = await shortLinkService_1.ShortLinkService.getStats(shortCode);
            if (!stats) {
                res.status(404).json({ error: 'Короткий код не найден' });
                return;
            }
            res.json(stats);
        }
        catch (error) {
            console.error('Ошибка при получении статистики:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
}
exports.ShortLinkController = ShortLinkController;
