"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocateAsset = allocateAsset;
exports.transferAsset = transferAsset;
exports.returnAsset = returnAsset;
const prisma_client_1 = require("../lib/prisma-client");
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const auditLogger_1 = require("../utils/auditLogger");
async function ensureActiveEmployee(employeeId) {
    const employee = await prisma_1.prisma.employee.findFirst({ where: { id: employeeId, isActive: true } });
    if (!employee)
        throw AppError_1.AppError.badRequest('Employee does not exist or is inactive');
}
async function allocateAsset(input, actorId) {
    await ensureActiveEmployee(input.employeeId);
    const allocation = await prisma_1.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: input.assetId } });
        if (!asset)
            throw AppError_1.AppError.notFound('Asset not found');
        if (asset.status !== prisma_client_1.AssetStatus.AVAILABLE)
            throw AppError_1.AppError.conflict('Only available assets can be allocated');
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
        await tx.asset.update({ where: { id: asset.id }, data: { status: prisma_client_1.AssetStatus.ALLOCATED } });
        return created;
    });
    await (0, auditLogger_1.logAudit)({
        entityType: 'Allocation', entityId: allocation.id, action: 'CREATE', performedById: actorId,
        changes: { assetId: input.assetId, employeeId: input.employeeId, status: prisma_client_1.AllocationStatus.ACTIVE },
    });
    return allocation;
}
async function transferAsset(allocationId, input, actorId) {
    await ensureActiveEmployee(input.newEmployeeId);
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const current = await tx.allocation.findUnique({ where: { id: allocationId } });
        if (!current)
            throw AppError_1.AppError.notFound('Allocation not found');
        if (current.status !== prisma_client_1.AllocationStatus.ACTIVE)
            throw AppError_1.AppError.conflict('Only active allocations can be transferred');
        await tx.allocation.update({ where: { id: current.id }, data: { status: prisma_client_1.AllocationStatus.TRANSFERRED } });
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
    await (0, auditLogger_1.logAudit)({
        entityType: 'Allocation', entityId: result.next.id, action: 'STATUS_CHANGE', performedById: actorId,
        changes: { previousAllocationId: allocationId, newEmployeeId: input.newEmployeeId, status: prisma_client_1.AllocationStatus.TRANSFERRED },
    });
    return result.next;
}
async function returnAsset(allocationId, input, actorId) {
    const allocation = await prisma_1.prisma.$transaction(async (tx) => {
        const current = await tx.allocation.findUnique({ where: { id: allocationId } });
        if (!current)
            throw AppError_1.AppError.notFound('Allocation not found');
        if (current.status !== prisma_client_1.AllocationStatus.ACTIVE)
            throw AppError_1.AppError.conflict('Only active allocations can be returned');
        const returned = await tx.allocation.update({
            where: { id: current.id },
            data: { status: prisma_client_1.AllocationStatus.RETURNED, returnedAt: new Date(), returnCondition: input.returnCondition, notes: input.notes ?? current.notes },
            include: { asset: true, employee: true },
        });
        await tx.asset.update({ where: { id: current.assetId }, data: { status: prisma_client_1.AssetStatus.AVAILABLE } });
        return returned;
    });
    await (0, auditLogger_1.logAudit)({
        entityType: 'Allocation', entityId: allocation.id, action: 'STATUS_CHANGE', performedById: actorId,
        changes: { status: prisma_client_1.AllocationStatus.RETURNED, returnCondition: input.returnCondition },
    });
    return allocation;
}
