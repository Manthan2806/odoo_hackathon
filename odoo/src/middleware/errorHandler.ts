import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../lib/prisma-client';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request data', err.flatten());
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      sendError(res, 409, 'CONFLICT', `A record with this ${(err.meta?.target as string[])?.join(', ') ?? 'value'} already exists`);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 404, 'NOT_FOUND', 'Record not found');
      return;
    }
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
}