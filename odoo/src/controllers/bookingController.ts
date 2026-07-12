import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { bookingDecisionSchema, createBookingSchema } from '../validators';
import * as BookingService from '../services/bookingService';

function actorId(req: Request): string { if (!req.user) throw AppError.unauthorized(); return req.user.employeeId; }

export const create = asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await BookingService.createBooking(createBookingSchema.parse(req.body), actorId(req)), 'Booking requested', 201));
export const decide = asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await BookingService.decideBooking(String(req.params.id), bookingDecisionSchema.parse(req.body), actorId(req))));
export const list = asyncHandler(async (_req: Request, res: Response) => sendSuccess(res, await BookingService.listBookings()));
