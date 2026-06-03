import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };
