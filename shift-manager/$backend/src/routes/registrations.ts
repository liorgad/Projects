import express from 'express';
import { 
  registerForShift, 
  getUserRegistrations,
  updateRegistrationStatus,
  cancelRegistration
} from '../controllers/registrations';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// User routes (authenticated)
router.post('/', authMiddleware, registerForShift);
router.get('/me', authMiddleware, getUserRegistrations);
router.put('/:id/cancel', authMiddleware, cancelRegistration);

// Admin routes
router.put('/:id/status', authMiddleware, adminMiddleware, updateRegistrationStatus);

export default router; 