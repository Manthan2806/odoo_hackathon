"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/categoryRoutes.ts
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
// import { authenticate } from '../middleware/authMiddleware'; 
const router = (0, express_1.Router)();
// Apply auth middleware to all routes in this file (Uncomment when ready)
// router.use(authenticate);
router.post('/', categoryController_1.createCategoryHandler);
router.get('/', categoryController_1.getCategoriesHandler);
exports.default = router;
