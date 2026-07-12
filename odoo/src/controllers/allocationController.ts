import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { allocateAssetSchema, returnAssetSchema, transferAssetSchema } from '../validators';
import * as AllocationService from '../services/allocationService';

function actorId(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.employeeId;
}

export const allocate = asyncHandler(async (req: Request, res: Response) => {
  const allocation = await AllocationService.allocateAsset(allocateAssetSchema.parse(req.body), actorId(req));
  sendSuccess(res, allocation, 'Asset allocated', 201);
});

export const transfer = asyncHandler(async (req: Request, res: Response) => {
  const allocation = await AllocationService.transferAsset(String(req.params.id), transferAssetSchema.parse(req.body), actorId(req));
  sendSuccess(res, allocation, 'Asset transferred');
});

export const returnAllocation = asyncHandler(async (req: Request, res: Response) => {
  const allocation = await AllocationService.returnAsset(String(req.params.id), returnAssetSchema.parse(req.body), actorId(req));
  sendSuccess(res, allocation, 'Asset returned');
});
