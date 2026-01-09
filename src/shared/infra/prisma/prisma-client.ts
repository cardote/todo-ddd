import { PrismaClient } from '@prisma/client/extension';

// Prisma singleton
export const prisma = new PrismaClient();
