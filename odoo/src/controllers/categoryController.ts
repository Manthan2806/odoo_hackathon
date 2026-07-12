// src/controllers/categoryController.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { createCategorySchema } from '../validators';
import * as CategoryService from '../services/categoryService';

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(createCategorySchema.parse(req.body), req.user?.employeeId);
  sendSuccess(res, category, 'Category created', 201);
});

export const getCategoriesHandler = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await CategoryService.getAllCategories());
});
