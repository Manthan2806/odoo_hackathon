import { AllocationStatus, AssetStatus } from '../lib/prisma-client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { logAudit } from '../utils/auditLogger';
import { AllocateAssetInput, ReturnAssetInput, TransferAssetInput } from '../validators';

async function ensureActiveEmployee(employeeId: string) {
  const employee = await prisma.employee.findFirst({ where: { id: employeeId, isActive: true } });
  if (!employee) throw AppError.badRequest('Employee does not exist or is inactive');
}

export async function allocateAsset(input: AllocateAssetInput, actorId: string) {
  await ensureActiveEmployee(input.employeeId);
  const allocation = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
    if (!asset) throw AppError.notFound('Asset not found');
    if (asset.status !== AssetStatus.AVAILABLE) throw AppError.conflict('Only available assets can be allocated');

    const created = await tx.allocation.create({
      data: {
        assetId: asset.id,
        employeeId: input.employeeId,
        allocatedById: actorId,
        expectedReturnDate: input.expectedReturnDate,
        notes: input.notes,
      },
      include: { asset: true, employee: true },
    });
    await tx.asset.update({ where: { id: asset.id }, data: { status: AssetStatus.ALLOCATED } });
    return created;
  });

  await logAudit({
    entityType: 'Allocation', entityId: allocation.id, action: 'CREATE', performedById: actorId,
    changes: { assetId: input.assetId, employeeId: input.employeeId, status: AllocationStatus.ACTIVE },
  });
  return allocation;
}

export async function transferAsset(allocationId: string, input: TransferAssetInput, actorId: string) {
  await ensureActiveEmployee(input.newEmployeeId);
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.allocation.findUnique({ where: { id: allocationId } });
    if (!current) throw AppError.notFound('Allocation not found');
    if (current.status !== AllocationStatus.ACTIVE) throw AppError.conflict('Only active allocations can be transferred');

    await tx.allocation.update({ where: { id: current.id }, data: { status: AllocationStatus.TRANSFERRED } });
    const next = await tx.allocation.create({
      data: {
        assetId: current.assetId,
        employeeId: input.newEmployeeId,
        allocatedById: actorId,
        expectedReturnDate: input.expectedReturnDate,
        notes: input.notes,
        previousAllocationId: current.id,
      },
      include: { asset: true, employee: true, previousAllocation: true },
    });
    return { current, next };
  });

  await logAudit({
    entityType: 'Allocation', entityId: result.next.id, action: 'STATUS_CHANGE', performedById: actorId,
    changes: { previousAllocationId: allocationId, newEmployeeId: input.newEmployeeId, status: AllocationStatus.TRANSFERRED },
  });
  return result.next;
}

export async function returnAsset(allocationId: string, input: ReturnAssetInput, actorId: string) {
  const allocation = await prisma.$transaction(async (tx) => {
    const current = await tx.allocation.findUnique({ where: { id: allocationId } });
    if (!current) throw AppError.notFound('Allocation not found');
    if (current.status !== AllocationStatus.ACTIVE) throw AppError.conflict('Only active allocations can be returned');

    const returned = await tx.allocation.update({
      where: { id: current.id },
      data: { status: AllocationStatus.RETURNED, returnedAt: new Date(), returnCondition: input.returnCondition, notes: input.notes ?? current.notes },
      include: { asset: true, employee: true },
    });
    await tx.asset.update({ where: { id: current.assetId }, data: { status: AssetStatus.AVAILABLE } });
    return returned;
  });

  await logAudit({
    entityType: 'Allocation', entityId: allocation.id, action: 'STATUS_CHANGE', performedById: actorId,
    changes: { status: AllocationStatus.RETURNED, returnCondition: input.returnCondition },
  });
  return allocation;
}
