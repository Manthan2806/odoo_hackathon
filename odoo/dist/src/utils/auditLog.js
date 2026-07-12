"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const prisma_1 = require("../config/prisma");
/**
 * Writes a single AuditLog row. Call this from every mutating service function
 * (create/update/delete/status-change) across all modules — Auth, Assets,
 * Allocations, Maintenance, Bookings, etc. — so audit history stays in one table.
 *
 * Intentionally fire-and-forget-safe: failures are logged but never thrown,
 * so a broken audit write can't block the actual business operation.
 */
async function logAudit(params) {
    try {
        await prisma_1.prisma.auditLog.create({
            data: {
                entityType: params.entityType,
                entityId: params.entityId,
                action: params.action,
                changes: params.changes,
                performedById: params.performedById,
                ipAddress: params.ipAddress,
            },
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to write audit log:', err);
    }
}
