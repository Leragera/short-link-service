import { prisma } from '../prisma/client';

export class ShortLinkRepository {
  static findByCode(shortCode: string) {
    return prisma.shortLink.findUnique({
      where: { shortCode },
    });
  }

  static create(shortCode: string, originalUrl: string) {
    return prisma.shortLink.create({
      data: {
        shortCode,
        originalUrl,
        clicks: 0,
      },
    });
  }

  static incrementClicks(shortCode: string) {
    return prisma.shortLink.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });
  }
}
