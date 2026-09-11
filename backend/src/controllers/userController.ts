import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

// Получить всех пользователей
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

// Создать пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    
    const user = await prisma.user.create({
      data: { email, name, password },
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
};