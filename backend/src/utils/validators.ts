import { z } from 'zod';

// Схема для создания короткой ссылки
export const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    .url('Некорректный URL')
    .startsWith('http://', 'URL должен начинаться с http://')
    .or(z.string().url().startsWith('https://', 'URL должен начинаться с https://'))
    .refine((value) => {
      const appUrl = process.env.APP_URL;

      if (!appUrl) {
        return true;
      }

      return new URL(value).origin !== new URL(appUrl).origin;
    }, 'Нельзя создать ссылку на этот сервис'),
});

// Тип, который создаётся из схемы (автоматически)
export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;