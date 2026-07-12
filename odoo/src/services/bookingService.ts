import { AssetStatus, BookingStatus } from '../lib/prisma-client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { logAudit } from '../utils/auditLogger';
import { BookingDecisionInput, CreateBookingInput } from '../validators';

export async function createBooking(input: CreateBookingInput, actorId: string) {
  const asset = await prisma.asset.findUnique({ where: { id: input.assetId } });
  if (!asset) throw AppError.notFound('Asset not found');
  if (asset.status !== AssetStatus.AVAILABLE) throw AppError.conflict('This asset is not currently bookable');

  const overlap = await prisma.booking.findFirst({
    where: {
      assetId: input.assetId,
      status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
      startDate: { lt: input.endDate },
      endDate: { gt: input.startDate },
    },
  });
  if (overlap) throw AppError.conflict('This asset already has an overlapping booking');

  const booking = await prisma.booking.create({
    data: { ...input, requestedById: actorId, status: BookingStatus.PENDING },
    include: { asset: true, requestedBy: true },
  });
  await logAudit({ entityType: 'Booking', entityId: booking.id, action: 'CREATE', performedById: actorId, changes: { assetId: input.assetId, startDate: input.startDate.toISOString(), endDate: input.endDate.toISOString(), status: booking.status } });
  return booking;
}

export async function decideBooking(bookingId: string, input: BookingDecisionInput, actorId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw AppError.notFound('Booking not found');
  if (booking.status !== BookingStatus.PENDING) throw AppError.conflict('Only pending bookings can be approved or rejected');

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: input.status, approvedById: actorId, approvedAt: new Date() },
    include: { asset: true, requestedBy: true, approvedBy: true },
  });
  await logAudit({ entityType: 'Booking', entityId: updated.id, action: 'STATUS_CHANGE', performedById: actorId, changes: { status: input.status } });
  return updated;
}

export function listBookings() {
  return prisma.booking.findMany({ include: { asset: { include: { category: true } }, requestedBy: true, approvedBy: true }, orderBy: { startDate: 'asc' } });
}
