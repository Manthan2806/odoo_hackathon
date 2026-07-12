import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { AuthUser } from '../types/express';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or malformed Authorization header');
  }

  const token = header.slice('Bearer '.length);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      employeeId: decoded.employeeId,
    };
    next();
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }
}