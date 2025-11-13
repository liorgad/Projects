import express from 'express';
import { getCurrentUser, updateProfile, login, register } from '../controllers/auth';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// router.get('/login', authMiddleware, getCurrentUser);
router.post('/login', login);
// router.post('/login', authMiddleware, getCurrentUser);
router.post('/register', authMiddleware, adminMiddleware, register);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);

export default router; 