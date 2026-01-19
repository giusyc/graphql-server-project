// src/db.ts
// Re-export the Prisma client instance from `src/lib/prisma` and expose the client type.
import prisma from "./lib/prisma.js";
export type { PrismaClient } from "./generated/prisma/client.js";

export { prisma };
