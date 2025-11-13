import express from 'express';
import { getAllShifts, getShiftById, createShift, updateShift, deleteShift } from '../controllers/shifts';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllShifts);
router.get('/:id', getShiftById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, createShift);
router.put('/:id', authMiddleware, adminMiddleware, updateShift);
router.delete('/:id', authMiddleware, adminMiddleware, deleteShift);

export default router; 