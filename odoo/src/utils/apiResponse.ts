import { Response } from 'express';

interface SuccessPayload<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const payload: SuccessPayload<T> = { success: true, data, message };
  res.status(statusCode).json(payload);
}

export function sendError(res: Response, statusCode: number, code: string, message: string, details?: unknown): void {
  const payload: ErrorPayload = { success: false, error: { code, message, details } };
  res.status(statusCode).json(payload);
}