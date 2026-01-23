import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { ProfileReader } from '@/tasks/application/services/profile-reader';

export class PrismaProfileReader implements ProfileReader {
  async existsById(profileId: ProfileId): Promise<boolean> {
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId.value,
      },
      select: {
        id: true,
      },
    });

    return !!profile;
  }
}
