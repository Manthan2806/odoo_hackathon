"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleMaintenance = scheduleMaintenance;
exports.updateMaintenanceStatus = updateMaintenanceStatus;
exports.listMaintenance = listMaintenance;
const prisma_client_1 = require("../lib/prisma-client");
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const auditLogger_1 = require("../utils/auditLogger");
async function scheduleMaintenance(input, actorId) {
    const maintenance = await prisma_1.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
        if (!asset)
            throw AppError_1.AppError.notFound('Asset not found');
        if (asset.status !== prisma_client_1.AssetStatus.AVAILABLE)
            throw AppError_1.AppError.conflict('Only available assets can enter maintenance');
        const created = await tx.maintenance.create({
            data: { ...input, reportedById: actorId, status: prisma_client_1.MaintenanceStatus.SCHEDULED },
            include: { asset: true, reportedBy: true },
        });
        await tx.asset.update({ where: { id: asset.id }, data: { status: prisma_client_1.AssetStatus.IN_MAINTENANCE } });
        return created;
    });
    await (0, auditLogger_1.logAudit)({ entityType: 'Maintenance', entityId: maintenance.id, action: 'CREATE', performedById: actorId, changes: { assetId: input.assetId, status: prisma_client_1.MaintenanceStatus.SCHEDULED } });
    return maintenance;
}
async function updateMaintenanceStatus(maintenanceId, input, actorId) {
    const maintenance = await prisma_1.prisma.$transaction(async (tx) => {
        const existing = await tx.maintenance.findUnique({ where: { id: maintenanceId } });
        if (!existing)
            throw AppError_1.AppError.notFound('Maintenance record not found');
        const completedDate = input.status === prisma_client_1.MaintenanceStatus.COMPLETED ? (input.completedDate ?? new Date()) : input.completedDate;
        const updated = await tx.maintenance.update({
            where: { id: maintenanceId },
            data: { ...input, completedDate },
            include: { asset: true, reportedBy: true },
        });
        if (input.status === prisma_client_1.MaintenanceStatus.COMPLETED || input.status === prisma_client_1.MaintenanceStatus.CANCELLED) {
            await tx.asset.update({ where: { id: existing.assetId }, data: { status: prisma_client_1.AssetStatus.AVAILABLE } });
        }
        else if (input.status === prisma_client_1.MaintenanceStatus.SCHEDULED || input.status === prisma_client_1.MaintenanceStatus.IN_PROGRESS) {
            await tx.asset.update({ where: { id: existing.assetId }, data: { status: prisma_client_1.AssetStatus.IN_MAINTENANCE } });
        }
        return updated;
    });
    await (0, auditLogger_1.logAudit)({ entityType: 'Maintenance', entityId: maintenance.id, action: 'STATUS_CHANGE', performedById: actorId, changes: { status: input.status } });
    return maintenance;
}
function listMaintenance() {
    return prisma_1.prisma.maintenance.findMany({ include: { asset: true, reportedBy: true }, orderBy: { scheduledDate: 'desc' } });
}
