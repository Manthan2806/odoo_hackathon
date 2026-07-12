"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
const prisma_1 = require("../config/prisma");
const auditLogger_1 = require("../utils/auditLogger");
async function createCategory(data, userId) {
    const category = await prisma_1.prisma.assetCategory.create({ data });
    await (0, auditLogger_1.logAudit)({
        entityType: 'AssetCategory',
        entityId: category.id,
        action: 'CREATE',
        changes: { name: category.name, description: category.description },
        performedById: userId,
    });
    return category;
}
function getAllCategories() {
    return prisma_1.prisma.assetCategory.findMany({ orderBy: { name: 'asc' } });
}
