import { Router } from 'express';
import { getSummary } from '../controllers/reportController';

const router = Router();
router.get('/summary', getSummary);
export default router;
