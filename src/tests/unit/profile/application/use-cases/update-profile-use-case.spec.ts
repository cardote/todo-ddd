import { EmailAlreadyInUseError } from '@/profile/application/errors/email-already-in-use-error';
import { InvalidProfileEmailError } from '@/profile/application/errors/invalid-profile-email-error';
import { InvalidProfileNameError } from '@/profile/application/errors/invalid-profile-name-error';
import { ProfileNotFoundError } from '@/profile/application/errors/profile-not-found-error';
import { UpdateProfileUseCase } from '@/profile/application/use-cases/update-profile-use-case';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { InMemoryProfileRepository } from '@/profile/infra/repositories/in-memory-profile-repository';
import { makeTestProfile } from '@/shared/__tests__/utils/make-test-profile';

describe('UpdateProfileUseCase (Unit)', () => {
  it('should update profile name successfully', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile = createProfile();
    await repo.save(profile);

    const result = await useCase.execute({
      profileId: profile.id.value,
      name: 'new-name',
    });

    expect(result.isRight()).toBe(true);

    const updatedProfile = await repo.findById(profile.id);

    expect(updatedProfile?.name.value).toBe('New-name');
  });

  it('should update profile email successfully', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile = createProfile();
    await repo.save(profile);

    const result = await useCase.execute({
      profileId: profile.id.value,
      email: 'new-email@email.com',
    });

    expect(result.isRight()).toBe(true);

    const updatedProfile = await repo.findById(profile.id);

    expect(updatedProfile?.email.value).toBe('new-email@email.com');
  });

  it('should return error when profile not found', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);

    const result = await useCase.execute({
      profileId: 'any-id',
      name: 'any-name',
      email: 'any-email@email.com',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProfileNotFoundError);
      expect(result.value.message).toBe('Profile not found.');
    }
  });

  it('should return error when email is already in use', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile1 = createProfile();
    await repo.save(profile1);

    const profile2 = createProfile(
      new ProfileId(),
      ProfileName.create('other-name').value,
      ProfileEmail.create('other-email@email.com').value,
    );
    await repo.save(profile2);

    const result = await useCase.execute({
      profileId: profile2.id.value,
      email: profile1.email.value,
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyInUseError);
      expect(result.value.message).toBe('Email already in use.');
    }
  });

  it('should return error when name is invalid', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile = createProfile();
    await repo.save(profile);

    const result = await useCase.execute({
      profileId: profile.id.value,
      name: 'A',
    });
    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidProfileNameError);
      expect(result.value.message).toBe('Invalid profile name.');
    }
  });

  it('should return error when email is invalid', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new UpdateProfileUseCase(repo);
    const { createProfile } = makeTestProfile();

    const profile = createProfile();
    await repo.save(profile);

    const result = await useCase.execute({
      profileId: profile.id.value,
      email: 'invalid-email',
    });
    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidProfileEmailError);
      expect(result.value.message).toBe('Invalid profile email.');
    }
  });
});
