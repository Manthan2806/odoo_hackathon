import { PrismaClient } from '../lib/prisma-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env';

// Prevents exhausting DB connections from hot-reload creating new clients in dev.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Prisma 7 removed the old datasources/datasourceUrl runtime options —
// the client now requires a driver adapter to connect to Postgres.
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = global.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}