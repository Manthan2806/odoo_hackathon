"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/assetRoutes.ts
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
// import { authenticate } from '../middleware/authMiddleware';
const router = (0, express_1.Router)();
// router.use(authenticate);
router.post('/', assetController_1.createAssetHandler);
router.get('/', assetController_1.getAssetsHandler);
exports.default = router;
