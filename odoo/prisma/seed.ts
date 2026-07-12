// prisma/seed.ts
import { PrismaClient, Role } from '../src/lib/prisma-client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { env } from '../src/config/env';

const adapter = new PrismaPg({ connectionString: env.databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding...');

  // 1. Departments
  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering' },
  });
  const operations = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: { name: 'Operations' },
  });

  // 2. Employees — one per role, plus one extra STAFF
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.employee.upsert({
    where: { email: 'admin@assetflow.dev' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@assetflow.dev',
      passwordHash,
      role: Role.ADMIN,
      departmentId: engineering.id,
      employeeCode: 'EMP-001',
    },
  });

  const manager = await prisma.employee.upsert({
    where: { email: 'manager@assetflow.dev' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@assetflow.dev',
      passwordHash,
      role: Role.MANAGER,
      departmentId: engineering.id,
      employeeCode: 'EMP-002',
    },
  });

  const staff1 = await prisma.employee.upsert({
    where: { email: 'staff1@assetflow.dev' },
    update: {},
    create: {
      name: 'Staff One',
      email: 'staff1@assetflow.dev',
      passwordHash,
      role: Role.STAFF,
      departmentId: operations.id,
      employeeCode: 'EMP-003',
    },
  });

  const staff2 = await prisma.employee.upsert({
    where: { email: 'staff2@assetflow.dev' },
    update: {},
    create: {
      name: 'Staff Two',
      email: 'staff2@assetflow.dev',
      passwordHash,
      role: Role.STAFF,
      departmentId: operations.id,
      employeeCode: 'EMP-004',
    },
  });

  console.log('Seeded:', {
    departments: [engineering.name, operations.name],
    employees: [admin.email, manager.email, staff1.email, staff2.email],
  });
  console.log('All passwords: Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });