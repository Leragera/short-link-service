import redis from './redis';
import { generateShortCode } from '../utils/generateCode';
import { ShortLinkRepository } from '../repositories/shortLinkRepository';

// Интерфейс для создания ссылки
export interface CreateShortLinkInput {
  originalUrl: string;
}

// Интерфейс для результата
export interface ShortLinkResult {
  shortCode: string;
  shortUrl: string;
}

// Интерфейс для статистики
export interface ShortLinkStats {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

export class ShortLinkService {
  // Создать короткую ссылку
  static async create(input: CreateShortLinkInput): Promise<ShortLinkResult> {
    // Генерируем уникальный код
    let shortCode: string;
    let isUnique = false;

    while (!isUnique) {
      shortCode = generateShortCode(6);

      const existing = await ShortLinkRepository.findByCode(shortCode);

      if (!existing) {
        isUnique = true;
      }
    }

    // Создаём запись в БД
    const shortLink = await ShortLinkRepository.create(shortCode!, input.originalUrl);

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
  static async getStats(shortCode: string): Promise<ShortLinkStats | null> {
    const shortLink = await ShortLinkRepository.findByCode(shortCode);

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
    static async handleRedirect(shortCode: string): Promise<string | null> {
    let cachedUrl: string | null = null;

    // Пытаемся получить из Redis, но не ломаем приложение, если он упал
    try {
      cachedUrl = await redis.get(`shortlink:${shortCode}`);
    } catch (redisError) {
      console.warn('Redis недоступен, переходим к PostgreSQL:', redisError);
    }

    if (cachedUrl) {
      await ShortLinkRepository.incrementClicks(shortCode);
      return cachedUrl;
    }

    // Если в кэше нет (или Redis упал), идем в БД
    const shortLink = await ShortLinkRepository.findByCode(shortCode);

    if (!shortLink) {
      return null;
    }

    // Пытаемся сохранить в кэш, но игнорируем ошибки, если Redis недоступен
    try {
      await redis.setex(`shortlink:${shortCode}`, 3600, shortLink.originalUrl);
    } catch (redisError) {
      console.warn('Не удалось сохранить в Redis:', redisError);
    }

    await ShortLinkRepository.incrementClicks(shortCode);

    return shortLink.originalUrl;
  }
}