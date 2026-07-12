import { AuditAction, Prisma } from '../lib/prisma-client';
import { prisma } from '../config/prisma';

interface LogAuditParams {
  entityType: string;
  entityId: string;
  action: AuditAction;
  changes?: Prisma.InputJsonValue;
  performedById?: string;
  ipAddress?: string;
}

/**
 * Writes a single AuditLog row. Call this from every mutating service function
 * (create/update/delete/status-change) across all modules — Auth, Assets,
 * Allocations, Maintenance, Bookings, etc. — so audit history stays in one table.
 *
 * Intentionally fire-and-forget-safe: failures are logged but never thrown,
 * so a broken audit write can't block the actual business operation.
 */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        changes: params.changes,
        performedById: params.performedById,
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write audit log:', err);
  }
}