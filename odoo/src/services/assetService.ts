// src/services/assetService.ts
import prisma from '../config/db';
// MOCK: Import your teammate's audit logger
// import { logAudit } from '../utils/auditLogger'; 

export const createAsset = async (data: any, userId: string) => {
  const asset = await prisma.asset.create({
    data,
  });

  // Call the shared audit log
  // await logAudit(userId, 'ASSET_CREATED', { assetId: asset.id, changes: data });

  return asset;
};

export const getAllAssets = async () => {
  return await prisma.asset.findMany({
    include: {
      category: true, // Joins the category data automatically
    }
  });
};