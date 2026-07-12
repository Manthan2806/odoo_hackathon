import { Request, Response, NextFunction } from 'express';
import { Role } from '../lib/prisma-client';
import { AppError } from '../utils/AppError';

/**
 * Usage: router.post('/departments', authenticate, requireRole('ADMIN'), handler)
 * Must run after `authenticate` — relies on req.user being set.
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(`This action requires one of the following roles: ${allowedRoles.join(', ')}`);
    }

    next();
  };
}