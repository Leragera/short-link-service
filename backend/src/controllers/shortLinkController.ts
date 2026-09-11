import { Request, Response } from 'express';
import { ShortLinkService } from '../services/shortLinkService';
import { shortenUrlSchema } from '../utils/validators';

export class ShortLinkController {
  // POST /api/shorten
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Валидация
      const validationResult = shortenUrlSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          error: 'Невалидный URL',
          details: validationResult.error.issues,
        });
        return;
      }

      // Вызываем сервис
      const result = await ShortLinkService.create(validationResult.data);

      res.status(201).json(result);
    } catch (error) {
      console.error('Ошибка при создании ссылки:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  // GET /:shortCode
  static async redirect(req: Request, res: Response): Promise<void> {
    try {
      // Явно указываем тип string
      const shortCode: string = req.params.shortCode as string;

      const originalUrl = await ShortLinkService.handleRedirect(shortCode);

      if (!originalUrl) {
        res.status(404).json({ error: 'Короткий код не найден' });
        return;
      }

      res.redirect(302, originalUrl);
    } catch (error) {
      console.error('Ошибка при редиректе:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }

  // GET /api/stats/:shortCode
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      // Явно указываем тип string
      const shortCode: string = req.params.shortCode as string;

      const stats = await ShortLinkService.getStats(shortCode);

      if (!stats) {
        res.status(404).json({ error: 'Короткий код не найден' });
        return;
      }

      res.json(stats);
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
}