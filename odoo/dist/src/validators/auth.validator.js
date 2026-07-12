"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const prisma_client_1 = require("../lib/prisma-client");
exports.registerSchema = zod_1.z.object({
    employeeCode: zod_1.z.string().min(1, 'Employee code is required'),
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    departmentId: zod_1.z.string().min(1, 'Department is required'),
    phone: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    // Role is optional and defaults to STAFF in the service layer.
    // Only an existing ADMIN should be able to set this to MANAGER/ADMIN —
    // enforced in the controller via req.user, not here.
    role: zod_1.z.nativeEnum(prisma_client_1.Role).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
