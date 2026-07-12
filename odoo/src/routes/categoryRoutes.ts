// src/routes/categoryRoutes.ts
import { Router } from 'express';
import { createCategoryHandler, getCategoriesHandler } from '../controllers/categoryController';
// import { authenticate } from '../middleware/authMiddleware'; 

const router = Router();

// Apply auth middleware to all routes in this file (Uncomment when ready)
// router.use(authenticate);

router.post('/', createCategoryHandler);
router.get('/', getCategoriesHandler);

export default router;