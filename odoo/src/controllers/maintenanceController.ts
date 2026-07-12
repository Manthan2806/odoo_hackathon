import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { createMaintenanceSchema, maintenanceStatusSchema } from '../validators';
import * as MaintenanceService from '../services/maintenanceService';

function actorId(req: Request): string { if (!req.user) throw AppError.unauthorized(); return req.user.employeeId; }

export const schedule = asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await MaintenanceService.scheduleMaintenance(createMaintenanceSchema.parse(req.body), actorId(req)), 'Maintenance scheduled', 201));
export const updateStatus = asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await MaintenanceService.updateMaintenanceStatus(String(req.params.id), maintenanceStatusSchema.parse(req.body), actorId(req))));
export const list = asyncHandler(async (_req: Request, res: Response) => sendSuccess(res, await MaintenanceService.listMaintenance()));
