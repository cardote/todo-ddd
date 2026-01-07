import { ProfileNotFoundError } from '@/profile/application/errors/profile-not-found-error';
import { GetProfileUseCase } from '@/profile/application/use-cases/get-profile-use-case';
import { InMemoryProfileRepository } from '@/profile/infra/repositories/in-memory-profile-repository';
import { makeTestProfile } from '@/shared/__tests__/utils/make-test-profile';

describe('GetProfileUseCase (Unit)', () => {
  it('should return profile successfully', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new GetProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile = createProfile();
    await repo.save(profile);

    const result = await useCase.execute({ profileId: profile.id.value });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.profile).toBeDefined();
      expect(result.value.profile.id).toBe(profile.id.value);
      expect(result.value.profile.name).toBe(profile.name.value);
      expect(result.value.profile.email).toBe(profile.email.value);
    }
  });

  it('should return error when profile not found', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new GetProfileUseCase(repo);

    const result = await useCase.execute({ profileId: 'any-id' });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProfileNotFoundError);
      expect(result.value.message).toBe('Profile not found.');
    }
  });
});
