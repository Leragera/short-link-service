import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userController';

const router = Router();

// GET /api/users — получить всех
router.get('/', getAllUsers);

// POST /api/users — создать
router.post('/', createUser);

export default router;