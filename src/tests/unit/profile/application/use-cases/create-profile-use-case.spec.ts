import { EmailAlreadyInUseError } from '@/profile/application/errors/email-already-in-use-error';
import { CreateProfileUseCase } from '@/profile/application/use-cases/create-profile-use-case';
import { InMemoryProfileRepository } from '@/profile/infra/repositories/in-memory-profile-repository';
import { makeTestProfile } from '@/tests/unit/shared/__tests__/utils/make-test-profile';
import { use } from 'react';

describe('CreateProfileUseCase (Unit)', () => {
  it('should create a profile successfully', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new CreateProfileUseCase(repo);
    const { createEmail } = makeTestProfile();

    const result = await useCase.execute({
      name: 'any-name',
      email: 'any-email@email.com',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.profileId).toBeDefined();

      const email = createEmail('any-email@email.com');

      const profile = await repo.findByEmail(email);

      expect(profile).not.toBeNull();
      expect(profile?.email.value).toBe(email.value);
      expect(profile?.name.value).toBe('Any-name');
    }
  });

  it('should return error when email is already in use', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new CreateProfileUseCase(repo);

    await useCase.execute({
      name: 'any-name',
      email: 'any-email@email.com',
    });

    const result = await useCase.execute({
      name: 'any-name',
      email: 'any-email@email.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError);

    if (result.isLeft()) {
      expect(result.value.message).toBe('Email already in use.');
    }
  });

  it('should return error when name is invalid', async () => {
    const repo = new InMemoryProfileRepository();
    const useCase = new CreateProfileUseCase(repo);
    const result = await useCase.execute({
      name: 'A',
      email: 'any-email@email.com',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value.message).toBe(
        'Profile name must be at least 3 characters long',
      );
    }
  });
});
