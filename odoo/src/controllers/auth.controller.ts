import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { registerEmployee, loginEmployee } from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await registerEmployee(input, req.user);
  sendSuccess(res, result, 'Employee registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await loginEmployee(input);
  sendSuccess(res, result, 'Login successful');
});