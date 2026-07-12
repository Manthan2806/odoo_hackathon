import { AssetStatus, MaintenanceStatus } from '../lib/prisma-client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { logAudit } from '../utils/auditLogger';
import { CreateMaintenanceInput, MaintenanceStatusInput } from '../validators';

export async function scheduleMaintenance(input: CreateMaintenanceInput, actorId: string) {
  const maintenance = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
    if (!asset) throw AppError.notFound('Asset not found');
    if (asset.status !== AssetStatus.AVAILABLE) throw AppError.conflict('Only available assets can enter maintenance');
    const created = await tx.maintenance.create({
      data: { ...input, reportedById: actorId, status: MaintenanceStatus.SCHEDULED },
      include: { asset: true, reportedBy: true },
    });
    await tx.asset.update({ where: { id: asset.id }, data: { status: AssetStatus.IN_MAINTENANCE } });
    return created;
  });
  await logAudit({ entityType: 'Maintenance', entityId: maintenance.id, action: 'CREATE', performedById: actorId, changes: { assetId: input.assetId, status: MaintenanceStatus.SCHEDULED } });
  return maintenance;
}

export async function updateMaintenanceStatus(maintenanceId: string, input: MaintenanceStatusInput, actorId: string) {
  const maintenance = await prisma.$transaction(async (tx) => {
    const existing = await tx.maintenance.findUnique({ where: { id: maintenanceId } });
    if (!existing) throw AppError.notFound('Maintenance record not found');
    const completedDate = input.status === MaintenanceStatus.COMPLETED ? (input.completedDate ?? new Date()) : input.completedDate;
    const updated = await tx.maintenance.update({
      where: { id: maintenanceId },
      data: { ...input, completedDate },
      include: { asset: true, reportedBy: true },
    });
    if (input.status === MaintenanceStatus.COMPLETED || input.status === MaintenanceStatus.CANCELLED) {
      await tx.asset.update({ where: { id: existing.assetId }, data: { status: AssetStatus.AVAILABLE } });
    } else if (input.status === MaintenanceStatus.SCHEDULED || input.status === MaintenanceStatus.IN_PROGRESS) {
      await tx.asset.update({ where: { id: existing.assetId }, data: { status: AssetStatus.IN_MAINTENANCE } });
    }
    return updated;
  });
  await logAudit({ entityType: 'Maintenance', entityId: maintenance.id, action: 'STATUS_CHANGE', performedById: actorId, changes: { status: input.status } });
  return maintenance;
}

export function listMaintenance() {
  return prisma.maintenance.findMany({ include: { asset: true, reportedBy: true }, orderBy: { scheduledDate: 'desc' } });
}
