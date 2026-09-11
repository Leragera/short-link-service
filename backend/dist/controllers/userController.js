"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const client_1 = require("../prisma/client");
// Получить всех пользователей
const getAllUsers = async (req, res) => {
    try {
        const users = await client_1.prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
};
exports.getAllUsers = getAllUsers;
// Создать пользователя
const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const user = await client_1.prisma.user.create({
            data: { email, name, password },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
};
exports.createUser = createUser;
