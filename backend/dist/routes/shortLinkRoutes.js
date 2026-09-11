"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectRouter = void 0;
const express_1 = require("express");
const shortLinkController_1 = require("../controllers/shortLinkController");
const router = (0, express_1.Router)();
// POST /api/shorten — создать короткую ссылку
router.post('/shorten', shortLinkController_1.ShortLinkController.create);
// GET /api/stats/:shortCode — получить статистику
// ВАЖНО: этот роут должен быть ДО роута с редиректом!
router.get('/stats/:shortCode', shortLinkController_1.ShortLinkController.getStats);
exports.default = router;
// Редирект — отдельный роутер, потому что URL без префикса /api
exports.redirectRouter = (0, express_1.Router)();
exports.redirectRouter.get('/:shortCode', shortLinkController_1.ShortLinkController.redirect);
