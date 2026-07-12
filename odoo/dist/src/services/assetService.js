"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsset = createAsset;
exports.getAllAssets = getAllAssets;
const prisma_1 = require("../config/prisma");
const auditLogger_1 = require("../utils/auditLogger");
const AppError_1 = require("../utils/AppError");
async function createAsset(data, userId) {
    const category = await prisma_1.prisma.assetCategory.findUnique({ where: { id: data.categoryId } });
    if (!category)
        throw AppError_1.AppError.notFound('Category not found');
    const asset = await prisma_1.prisma.asset.create({ data });
    await (0, auditLogger_1.logAudit)({
        entityType: 'Asset',
        entityId: asset.id,
        action: 'CREATE',
        changes: { assetTag: asset.assetTag, name: asset.name, categoryId: asset.categoryId },
        performedById: userId,
    });
    return asset;
}
function getAllAssets() {
    return prisma_1.prisma.asset.findMany({
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
