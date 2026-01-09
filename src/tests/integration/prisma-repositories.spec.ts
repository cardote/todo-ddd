import { Profile } from '@/profile/domain/entities/profile';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { PrismaProfileRepository } from '@/profile/infra/prisma/repositories/prisma-profile-repository';
import { prisma } from '@/shared/infra/prisma/prisma-client';

beforeAll(async () => {
  await prisma.$connect();
  await prisma.task.deleteMany();
  await prisma.profile.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Prisma repositories (Integration)', () => {
  it('should upsert and rehydrate Profile correctly', async () => {
    const profilesRepo = new PrismaProfileRepository();
    const name = ProfileName.create('any-name').value;
    const email = ProfileEmail.create('any-email@email.com').value;

    const profile = Profile.create({ name, email });

    await profilesRepo.save(profile);

    const rehydratedProfile = await profilesRepo.findById(profile.id);

    expect(rehydratedProfile).not.toBeNull();
    expect(rehydratedProfile?.id.value).toBe(profile.id.value);
    expect(rehydratedProfile?.name.value).toBe(profile.name.value);
    expect(rehydratedProfile?.email.value).toBe(profile.email.value);
  });
});
