import { Router } from 'express';
import { list, schedule, updateStatus } from '../controllers/maintenanceController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
router.get('/', list);
router.post('/', authenticate, requireRole('ADMIN', 'MANAGER'), schedule);
router.patch('/:id/status', authenticate, requireRole('ADMIN', 'MANAGER'), updateStatus);
export default router;
