import { InMemoryProfileRepository } from '@/profile/infra/repositories/in-memory-profile-repository';
import { makeTestProfile } from '@/shared/__tests__/utils/make-test-profile';

describe('InMemoryProfileRepository (Unit)', () => {
  it('should save and find a profile by id', async () => {
    const repo = new InMemoryProfileRepository();
    const profile = makeTestProfile().createProfile();

    await repo.save(profile);

    const result = await repo.findById(profile.id);

    expect(result).not.toBeNull();
    expect(result?.id.value).toBe(profile.id.value);
    expect(result?.name.value).toBe(profile.name.value);
    expect(result?.email.value).toBe(profile.email.value);
  });

  it('should save and find a profile by email', async () => {
    const repo = new InMemoryProfileRepository();
    const profile = makeTestProfile().createProfile();

    await repo.save(profile);

    const result = await repo.findByEmail(profile.email);

    expect(result).not.toBeNull();
    expect(result?.id.value).toBe(profile.id.value);
    expect(result?.name.value).toBe(profile.name.value);
    expect(result?.email.value).toBe(profile.email.value);
  });

  it('should return null when profile not found by id', async () => {
    const repo = new InMemoryProfileRepository();
    const result = await repo.findById(makeTestProfile().createProfile().id);

    expect(result).toBeNull();
  });

  it('should update email index when saving an existing profile with a new email', async () => {
    const repo = new InMemoryProfileRepository();
    const { createProfile, createEmail } = makeTestProfile();
    const profile = createProfile();
    const oldEmail = profile.email;

    await repo.save(profile);

    // Change email
    const newEmail = createEmail('new-email@email.com');
    profile.changeEmail(newEmail);
    await repo.save(profile);

    const resultFindByOldEmail = await repo.findByEmail(oldEmail);
    expect(resultFindByOldEmail).toBeNull();

    const resultFindByNewEmail = await repo.findByEmail(newEmail);
    expect(resultFindByNewEmail).not.toBeNull();
    expect(resultFindByNewEmail?.id.value).toBe(profile.id.value);
  });
});
