import { Profile } from '@/profile/domain/entities/profile';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { PrismaUniqueConstraintError } from '@/profile/infra/prisma/errors/prisma-unique-constraint-error';
import { PrismaProfileRepository } from '@/profile/infra/prisma/repositories/prisma-profile-repository';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { Task } from '@/tasks/domain/aggregates/task';
import { ProfileId } from '@/tasks/domain/value-objects/profile-id';
import { TaskId } from '@/tasks/domain/value-objects/task-id';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';
import { PrismaTaskRepository } from '@/tasks/infra/prisma/repositories/prisma-task-repository';

beforeAll(async () => {
  await prisma.$connect();
  await prisma.task.deleteMany();
  await prisma.profile.deleteMany();
  console.log('oba fui chamado');
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

    // change email and save again
    profile.changeEmail(ProfileEmail.create('new-email@email.com').value);
    await profilesRepo.save(profile);

    const rehydratedProfile2 = await profilesRepo.findById(profile.id);

    expect(rehydratedProfile2).not.toBeNull();
    expect(rehydratedProfile2?.id.value).toBe(profile.id.value);
    expect(rehydratedProfile2?.name.value).toBe(profile.name.value);
    expect(rehydratedProfile2?.email.value).toBe(profile.email.value);
  });

  it('should upsert and rehydrate Task correctly', async () => {
    const profilesRepo = new PrismaProfileRepository();
    const name = ProfileName.create('any-name').value;
    const email = ProfileEmail.create('any-email@email.com').value;

    const profile = Profile.create({ name, email });

    await profilesRepo.save(profile);

    const taskRepo = new PrismaTaskRepository();
    const title = TaskTitle.create('any-title').value;
    const ownerProfileId = profile.id;

    const task = Task.create(
      {
        title,
        ownerProfileId,
        createdAt: new Date(),
      },
      new TaskId('any-task-id'),
    );

    await taskRepo.save(task);

    const rehydratedTask = await taskRepo.findById(task.id);

    expect(rehydratedTask).not.toBeNull();
    expect(rehydratedTask?.id.value).toBe(task.id.value);
    expect(rehydratedTask?.title.value).toBe(task.title.value);
    expect(rehydratedTask?.ownerProfileId.value).toBe(
      task.ownerProfileId.value,
    );
  });

  it('should fail unique email constraint at DB level', async () => {
    const profilesRepo = new PrismaProfileRepository();

    const name1 = ProfileName.create('any-name').value;
    const email1 = ProfileEmail.create('any-email1@email.com').value;

    const profile1 = Profile.create({ name: name1, email: email1 });

    await profilesRepo.save(profile1);

    const name2 = ProfileName.create('any-name').value;
    const email2 = ProfileEmail.create('any-email1@email.com').value;

    const profile2 = Profile.create({ name: name2, email: email2 });

    expect(async () => await profilesRepo.save(profile2)).rejects.toThrow(
      PrismaUniqueConstraintError,
    );
  });
});
