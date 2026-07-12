"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.decideBooking = decideBooking;
exports.listBookings = listBookings;
const prisma_client_1 = require("../lib/prisma-client");
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const auditLogger_1 = require("../utils/auditLogger");
async function createBooking(input, actorId) {
    const asset = await prisma_1.prisma.asset.findUnique({ where: { id: input.assetId } });
    if (!asset)
        throw AppError_1.AppError.notFound('Asset not found');
    if (asset.status !== prisma_client_1.AssetStatus.AVAILABLE)
        throw AppError_1.AppError.conflict('This asset is not currently bookable');
    const overlap = await prisma_1.prisma.booking.findFirst({
        where: {
            assetId: input.assetId,
            status: { in: [prisma_client_1.BookingStatus.PENDING, prisma_client_1.BookingStatus.APPROVED] },
            startDate: { lt: input.endDate },
            endDate: { gt: input.startDate },
        },
    });
    if (overlap)
        throw AppError_1.AppError.conflict('This asset already has an overlapping booking');
    const booking = await prisma_1.prisma.booking.create({
        data: { ...input, requestedById: actorId, status: prisma_client_1.BookingStatus.PENDING },
        include: { asset: true, requestedBy: true },
    });
    await (0, auditLogger_1.logAudit)({ entityType: 'Booking', entityId: booking.id, action: 'CREATE', performedById: actorId, changes: { assetId: input.assetId, startDate: input.startDate.toISOString(), endDate: input.endDate.toISOString(), status: booking.status } });
    return booking;
}
async function decideBooking(bookingId, input, actorId) {
    const booking = await prisma_1.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking)
        throw AppError_1.AppError.notFound('Booking not found');
    if (booking.status !== prisma_client_1.BookingStatus.PENDING)
        throw AppError_1.AppError.conflict('Only pending bookings can be approved or rejected');
    const updated = await prisma_1.prisma.booking.update({
        where: { id: bookingId },
        data: { status: input.status, approvedById: actorId, approvedAt: new Date() },
        include: { asset: true, requestedBy: true, approvedBy: true },
    });
    await (0, auditLogger_1.logAudit)({ entityType: 'Booking', entityId: updated.id, action: 'STATUS_CHANGE', performedById: actorId, changes: { status: input.status } });
    return updated;
}
function listBookings() {
    return prisma_1.prisma.booking.findMany({ include: { asset: { include: { category: true } }, requestedBy: true, approvedBy: true }, orderBy: { startDate: 'asc' } });
}
