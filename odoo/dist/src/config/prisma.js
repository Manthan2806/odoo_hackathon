"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_client_1 = require("../lib/prisma-client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
// Prisma 7 removed the old datasources/datasourceUrl runtime options —
// the client now requires a driver adapter to connect to Postgres.
const adapter = new adapter_pg_1.PrismaPg({ connectionString: env_1.env.databaseUrl });
exports.prisma = global.__prisma ?? new prisma_client_1.PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') {
    global.__prisma = exports.prisma;
}
