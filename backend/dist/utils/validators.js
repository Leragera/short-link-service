"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrlSchema = void 0;
const zod_1 = require("zod");
// Схема для создания короткой ссылки
exports.shortenUrlSchema = zod_1.z.object({
    originalUrl: zod_1.z
        .string()
        .url('Некорректный URL')
        .startsWith('http://', 'URL должен начинаться с http://')
        .or(zod_1.z.string().url().startsWith('https://', 'URL должен начинаться с https://'))
        .refine((value) => {
        const appUrl = process.env.APP_URL;
        if (!appUrl) {
            return true;
        }
        return new URL(value).origin !== new URL(appUrl).origin;
    }, 'Нельзя создать ссылку на этот сервис'),
});
