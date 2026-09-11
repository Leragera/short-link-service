"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// GET /api/users — получить всех
router.get('/', userController_1.getAllUsers);
// POST /api/users — создать
router.post('/', userController_1.createUser);
exports.default = router;
