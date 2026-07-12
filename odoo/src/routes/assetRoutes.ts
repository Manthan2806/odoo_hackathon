// src/routes/assetRoutes.ts
import { Router } from 'express';
import { createAssetHandler, getAssetsHandler } from '../controllers/assetController';
// import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// router.use(authenticate);

router.post('/', createAssetHandler);
router.get('/', getAssetsHandler);

export default router;