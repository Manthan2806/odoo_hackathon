import { z } from 'zod';
import { BookingStatus, MaintenanceStatus } from '../lib/prisma-client';

const optionalDate = z.coerce.date().optional();

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
});

export const createAssetSchema = z.object({
  assetTag: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(200),
  categoryId: z.string().min(1),
  serialNumber: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  purchaseDate: optionalDate,
  purchaseCost: z.coerce.number().nonnegative().optional(),
  currentValue: z.coerce.number().nonnegative().optional(),
  warrantyExpiry: optionalDate,
  imageUrl: z.string().url().optional(),
});

export const allocateAssetSchema = z.object({
  assetId: z.string().min(1),
  employeeId: z.string().min(1),
  expectedReturnDate: optionalDate,
  notes: z.string().trim().max(2_000).optional(),
});

export const transferAssetSchema = z.object({
  newEmployeeId: z.string().min(1),
  expectedReturnDate: optionalDate,
  notes: z.string().trim().max(2_000).optional(),
});

export const returnAssetSchema = z.object({
  returnCondition: z.string().trim().min(1).max(2_000),
  notes: z.string().trim().max(2_000).optional(),
});

export const createBookingSchema = z.object({
  assetId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  purpose: z.string().trim().max(1_000).optional(),
}).refine((value) => value.endDate > value.startDate, {
  message: 'endDate must be after startDate',
  path: ['endDate'],
});

export const bookingDecisionSchema = z.object({
  status: z.enum([BookingStatus.APPROVED, BookingStatus.REJECTED]),
});

export const createMaintenanceSchema = z.object({
  assetId: z.string().min(1),
  issueDescription: z.string().trim().min(1).max(2_000),
  scheduledDate: z.coerce.date(),
  cost: z.coerce.number().nonnegative().optional(),
  vendor: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2_000).optional(),
});

export const maintenanceStatusSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus),
  completedDate: optionalDate,
  cost: z.coerce.number().nonnegative().optional(),
  vendor: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2_000).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type AllocateAssetInput = z.infer<typeof allocateAssetSchema>;
export type TransferAssetInput = z.infer<typeof transferAssetSchema>;
export type ReturnAssetInput = z.infer<typeof returnAssetSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingDecisionInput = z.infer<typeof bookingDecisionSchema>;
export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type MaintenanceStatusInput = z.infer<typeof maintenanceStatusSchema>;
