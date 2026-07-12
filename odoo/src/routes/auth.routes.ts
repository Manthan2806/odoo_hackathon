import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.post('/login', login);

// Only an existing ADMIN can create new employee accounts.
// The very first ADMIN account is created by the seed script, not this route.
router.post('/register', authenticate, requireRole('ADMIN'), register);

export default router;