import { z } from 'zod';
import { Role } from '../lib/prisma-client';

export const registerSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  departmentId: z.string().min(1, 'Department is required'),
  phone: z.string().optional(),
  designation: z.string().optional(),
  // Role is optional and defaults to STAFF in the service layer.
  // Only an existing ADMIN should be able to set this to MANAGER/ADMIN —
  // enforced in the controller via req.user, not here.
  role: z.nativeEnum(Role).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;