import { Router } from 'express';
import { ShortLinkController } from '../controllers/shortLinkController';

const router = Router();

// POST /api/shorten — создать короткую ссылку
router.post('/shorten', ShortLinkController.create);

// GET /api/stats/:shortCode — получить статистику
router.get('/stats/:shortCode', ShortLinkController.getStats);

export default router;

// Редирект — отдельный роутер, потому что URL без префикса /api
export const redirectRouter = Router();
redirectRouter.get('/:shortCode', ShortLinkController.redirect);