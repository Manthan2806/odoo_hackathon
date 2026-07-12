"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEmployee = registerEmployee;
exports.loginEmployee = loginEmployee;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../lib/prisma-client");
const prisma_1 = require("../config/prisma");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const auditLog_1 = require("../utils/auditLog");
const SALT_ROUNDS = 10;
function toPublicEmployee(employee) {
    const { id, employeeCode, name, email, phone, designation, role, isActive, departmentId } = employee;
    return { id, employeeCode, name, email, phone, designation, role, isActive, departmentId };
}
function signToken(employee) {
    return jsonwebtoken_1.default.sign({ id: employee.id, employeeId: employee.id, role: employee.role }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
}
async function registerEmployee(input, requestedBy) {
    if (input.role && input.role !== prisma_client_1.Role.STAFF && requestedBy && requestedBy.role !== prisma_client_1.Role.ADMIN) {
        throw AppError_1.AppError.forbidden('Only an admin can assign elevated roles');
    }
    const existing = await prisma_1.prisma.employee.findFirst({
        where: { OR: [{ email: input.email }, { employeeCode: input.employeeCode }] },
    });
    if (existing) {
        throw AppError_1.AppError.conflict('An employee with this email or employee code already exists');
    }
    const department = await prisma_1.prisma.department.findUnique({ where: { id: input.departmentId } });
    if (!department) {
        throw AppError_1.AppError.badRequest('Invalid departmentId');
    }
    const passwordHash = await bcrypt_1.default.hash(input.password, SALT_ROUNDS);
    const employee = await prisma_1.prisma.employee.create({
        data: {
            employeeCode: input.employeeCode,
            name: input.name,
            email: input.email,
            passwordHash,
            phone: input.phone,
            designation: input.designation,
            departmentId: input.departmentId,
            role: input.role ?? prisma_client_1.Role.STAFF,
        },
    });
    await (0, auditLog_1.logAudit)({
        entityType: 'Employee',
        entityId: employee.id,
        action: 'CREATE',
        performedById: employee.id,
    });
    const token = signToken(employee);
    return { token, employee: toPublicEmployee(employee) };
}
async function loginEmployee(input) {
    const employee = await prisma_1.prisma.employee.findUnique({ where: { email: input.email } });
    if (!employee || !employee.isActive) {
        throw AppError_1.AppError.unauthorized('Invalid email or password');
    }
    const passwordMatches = await bcrypt_1.default.compare(input.password, employee.passwordHash);
    if (!passwordMatches) {
        throw AppError_1.AppError.unauthorized('Invalid email or password');
    }
    await (0, auditLog_1.logAudit)({
        entityType: 'Employee',
        entityId: employee.id,
        action: 'LOGIN',
        performedById: employee.id,
    });
    const token = signToken(employee);
    return { token, employee: toPublicEmployee(employee) };
}
