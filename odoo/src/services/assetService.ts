import { prisma } from '../config/prisma';
import { logAudit } from '../utils/auditLogger';
import { CreateAssetInput } from '../validators';
import { AppError } from '../utils/AppError';

export async function createAsset(data: CreateAssetInput, userId?: string) {
  const category = await prisma.assetCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) throw AppError.notFound('Category not found');

  const asset = await prisma.asset.create({ data });
  await logAudit({
    entityType: 'Asset',
    entityId: asset.id,
    action: 'CREATE',
    changes: { assetTag: asset.assetTag, name: asset.name, categoryId: asset.categoryId },
    performedById: userId,
  });
  return asset;
}

export function getAllAssets() {
  return prisma.asset.findMany({
    include: {
      category: true,
      allocations: {
        where: { status: 'ACTIVE' },
        take: 1,
        include: { employee: { include: { department: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
