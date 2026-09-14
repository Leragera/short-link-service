"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortLinkRepository = void 0;
const client_1 = require("../prisma/client");
class ShortLinkRepository {
    static findByCode(shortCode) {
        return client_1.prisma.shortLink.findUnique({
            where: { shortCode },
        });
    }
    static create(shortCode, originalUrl) {
        return client_1.prisma.shortLink.create({
            data: {
                shortCode,
                originalUrl,
                clicks: 0,
            },
        });
    }
    static incrementClicks(shortCode) {
        return client_1.prisma.shortLink.update({
            where: { shortCode },
            data: { clicks: { increment: 1 } },
        });
    }
}
exports.ShortLinkRepository = ShortLinkRepository;
