import { prisma } from '../config/prisma';
import { logAudit } from '../utils/auditLogger';
import { CreateCategoryInput } from '../validators';

export async function createCategory(data: CreateCategoryInput, userId?: string) {
  const category = await prisma.assetCategory.create({ data });
  await logAudit({
    entityType: 'AssetCategory',
    entityId: category.id,
    action: 'CREATE',
    changes: { name: category.name, description: category.description },
    performedById: userId,
  });
  return category;
}

export function getAllCategories() {
  return prisma.assetCategory.findMany({ orderBy: { name: 'asc' } });
}
