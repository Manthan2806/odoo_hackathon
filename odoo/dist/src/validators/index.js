"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceStatusSchema = exports.createMaintenanceSchema = exports.bookingDecisionSchema = exports.createBookingSchema = exports.returnAssetSchema = exports.transferAssetSchema = exports.allocateAssetSchema = exports.createAssetSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const prisma_client_1 = require("../lib/prisma-client");
const optionalDate = zod_1.z.coerce.date().optional();
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().max(500).optional(),
});
exports.createAssetSchema = zod_1.z.object({
    assetTag: zod_1.z.string().trim().min(1).max(100),
    name: zod_1.z.string().trim().min(1).max(200),
    categoryId: zod_1.z.string().min(1),
    serialNumber: zod_1.z.string().trim().max(200).optional(),
    location: zod_1.z.string().trim().max(200).optional(),
    purchaseDate: optionalDate,
    purchaseCost: zod_1.z.coerce.number().nonnegative().optional(),
    currentValue: zod_1.z.coerce.number().nonnegative().optional(),
    warrantyExpiry: optionalDate,
    imageUrl: zod_1.z.string().url().optional(),
});
exports.allocateAssetSchema = zod_1.z.object({
    assetId: zod_1.z.string().min(1),
    employeeId: zod_1.z.string().min(1),
    expectedReturnDate: optionalDate,
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.transferAssetSchema = zod_1.z.object({
    newEmployeeId: zod_1.z.string().min(1),
    expectedReturnDate: optionalDate,
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.returnAssetSchema = zod_1.z.object({
    returnCondition: zod_1.z.string().trim().min(1).max(2_000),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.createBookingSchema = zod_1.z.object({
    assetId: zod_1.z.string().min(1),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    purpose: zod_1.z.string().trim().max(1_000).optional(),
}).refine((value) => value.endDate > value.startDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
});
exports.bookingDecisionSchema = zod_1.z.object({
    status: zod_1.z.enum([prisma_client_1.BookingStatus.APPROVED, prisma_client_1.BookingStatus.REJECTED]),
});
exports.createMaintenanceSchema = zod_1.z.object({
    assetId: zod_1.z.string().min(1),
    issueDescription: zod_1.z.string().trim().min(1).max(2_000),
    scheduledDate: zod_1.z.coerce.date(),
    cost: zod_1.z.coerce.number().nonnegative().optional(),
    vendor: zod_1.z.string().trim().max(200).optional(),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
exports.maintenanceStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(prisma_client_1.MaintenanceStatus),
    completedDate: optionalDate,
    cost: zod_1.z.coerce.number().nonnegative().optional(),
    vendor: zod_1.z.string().trim().max(200).optional(),
    notes: zod_1.z.string().trim().max(2_000).optional(),
});
