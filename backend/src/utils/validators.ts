import { z } from 'zod';

// Схема для создания короткой ссылки
export const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    .url('Некорректный URL')
    .refine(
      (value) => ['http:', 'https:'].includes(new URL(value).protocol),
      'URL должен начинаться с http:// или https://',
    )
    .refine((value) => {
      const appUrl = process.env.APP_URL;

      if (!appUrl) {
        return true;
      }

      try {
        return new URL(value).origin !== new URL(appUrl).origin;
      } catch {
        return true;
      }
    }, 'Нельзя создать ссылку на этот сервис'),
});

// Тип, который создаётся из схемы (автоматически)
export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;