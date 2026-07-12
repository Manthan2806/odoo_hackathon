import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { getSummaryReport } from '../services/reportService';

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await getSummaryReport());
});
