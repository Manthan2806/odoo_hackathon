// src/controllers/categoryController.ts
import { Request, Response, NextFunction } from 'express';
import { createCategorySchema } from '../validators';
import * as CategoryService from '../services/categoryService';

export const createCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await CategoryService.createCategory(validatedData);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.errors || error.message });
  }
};

export const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};