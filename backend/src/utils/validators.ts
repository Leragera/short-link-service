import { z } from 'zod';

// Схема для создания короткой ссылки
export const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    .url('Некорректный URL')
    .startsWith('http://', 'URL должен начинаться с http://')
    .or(z.string().url().startsWith('https://', 'URL должен начинаться с https://')),
});

// Тип, который создаётся из схемы (автоматически)
export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;