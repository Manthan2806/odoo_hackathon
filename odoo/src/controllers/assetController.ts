import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { createAssetSchema } from '../validators';
import * as AssetService from '../services/assetService';

export const createAssetHandler = asyncHandler(async (req: Request, res: Response) => {
  const asset = await AssetService.createAsset(createAssetSchema.parse(req.body), req.user?.employeeId);
  sendSuccess(res, asset, 'Asset created', 201);
});

export const getAssetsHandler = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await AssetService.getAllAssets());
});
