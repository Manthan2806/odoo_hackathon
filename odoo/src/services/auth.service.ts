import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '../lib/prisma-client';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { logAudit } from '../utils/auditLog';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const SALT_ROUNDS = 10;

function toPublicEmployee(employee: {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  role: Role;
  isActive: boolean;
  departmentId: string;
}) {
  const { id, employeeCode, name, email, phone, designation, role, isActive, departmentId } = employee;
  return { id, employeeCode, name, email, phone, designation, role, isActive, departmentId };
}

function signToken(employee: { id: string; role: Role }) {
  return jwt.sign(
    { id: employee.id, employeeId: employee.id, role: employee.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function registerEmployee(input: RegisterInput, requestedBy?: { role: Role }) {
  if (input.role && input.role !== Role.STAFF && requestedBy && requestedBy.role !== Role.ADMIN) {
    throw AppError.forbidden('Only an admin can assign elevated roles');
  }

  const existing = await prisma.employee.findFirst({
    where: { OR: [{ email: input.email }, { employeeCode: input.employeeCode }] },
  });

  if (existing) {
    throw AppError.conflict('An employee with this email or employee code already exists');
  }

  const department = await prisma.department.findUnique({ where: { id: input.departmentId } });
  if (!department) {
    throw AppError.badRequest('Invalid departmentId');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const employee = await prisma.employee.create({
    data: {
      employeeCode: input.employeeCode,
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      designation: input.designation,
      departmentId: input.departmentId,
      role: input.role ?? Role.STAFF,
    },
  });

  await logAudit({
    entityType: 'Employee',
    entityId: employee.id,
    action: 'CREATE',
    performedById: employee.id,
  });

  const token = signToken(employee);
  return { token, employee: toPublicEmployee(employee) };
}

export async function loginEmployee(input: LoginInput) {
  const employee = await prisma.employee.findUnique({ where: { email: input.email } });

  if (!employee || !employee.isActive) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(input.password, employee.passwordHash);
  if (!passwordMatches) {
    throw AppError.unauthorized('Invalid email or password');
  }

  await logAudit({
    entityType: 'Employee',
    entityId: employee.id,
    action: 'LOGIN',
    performedById: employee.id,
  });

  const token = signToken(employee);
  return { token, employee: toPublicEmployee(employee) };
}