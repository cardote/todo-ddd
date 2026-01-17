import { prisma } from '@/shared/infra/prisma/prisma-client';

export async function resetDb() {
  await prisma.outboxMessage?.deleteMany().catch(() => {});
  await prisma.task.deleteMany();
  await prisma.profile.deleteMany();
}
