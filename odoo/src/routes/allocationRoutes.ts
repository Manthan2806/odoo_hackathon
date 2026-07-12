import { Router } from 'express';
import { allocate, returnAllocation, transfer } from '../controllers/allocationController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
router.use(authenticate, requireRole('ADMIN', 'MANAGER'));
router.post('/', allocate);
router.post('/:id/transfer', transfer);
router.post('/:id/return', returnAllocation);
export default router;
