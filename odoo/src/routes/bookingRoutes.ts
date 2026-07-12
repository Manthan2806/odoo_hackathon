import { Router } from 'express';
import { create, decide, list } from '../controllers/bookingController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
router.get('/', list);
router.post('/', authenticate, create);
router.patch('/:id/decision', authenticate, requireRole('ADMIN', 'MANAGER'), decide);
export default router;
