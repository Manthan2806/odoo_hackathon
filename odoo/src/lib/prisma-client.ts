// Single source of truth for importing the generated Prisma client.
// Every other file imports PrismaClient/Role/Prisma/etc. from here instead
// of reaching into '../../generated/prisma/client' directly — if the
// generator `output` path in schema.prisma ever changes, fix it only here.
export * from '../../generated/prisma/client';