import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { Either, left, right } from '@/shared/kernel/either';
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error';
import { Profile } from '@/profile/domain/entities/profile';

type CreateProfileUseCaseInput = {
  name: string;
  email: string;
};

type CreateProfileUseCaseOutput = {
  profileId: string;
};

export class CreateProfileUseCase {
  constructor(private readonly profiles: ProfileRepository) {}
  async execute(
    input: CreateProfileUseCaseInput,
  ): Promise<Either<Error, CreateProfileUseCaseOutput>> {
    // Business logic to create a profile goes here
    // For example, check if email already exists, create profile entity, save to repository, etc.
    const name = ProfileName.create(input.name);
    if (name.isFailure) {
      return left(new Error(name.error));
    }

    const email = ProfileEmail.create(input.email);
    if (email.isFailure) {
      return left(new Error(email.error));
    }

    const existingProfile = await this.profiles.findByEmail(email.value);
    if (existingProfile) {
      return left(new EmailAlreadyInUseError());
    }

    const profile = Profile.create({ name: name.value, email: email.value });

    await this.profiles.save(profile);

    return right({ profileId: profile.id.value });
  }
}
