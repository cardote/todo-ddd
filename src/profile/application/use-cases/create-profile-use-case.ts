import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { Either, left, right } from '@/shared/kernel/either';
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error';
import { Profile } from '@/profile/domain/entities/profile';
import { InvalidProfileNameError } from '../errors/invalid-profile-name-error';
import { InvalidProfileEmailError } from '../errors/invalid-profile-email-error';

type CreateProfileUseCaseInput = {
  name: string;
  email: string;
};

type CreateProfileUseCaseOutput = {
  profileId: string;
};

export type CreateProfileError =
  | InvalidProfileNameError
  | InvalidProfileEmailError
  | EmailAlreadyInUseError;

export class CreateProfileUseCase {
  constructor(private readonly profiles: ProfileRepository) {}
  async execute(
    input: CreateProfileUseCaseInput,
  ): Promise<Either<CreateProfileError, CreateProfileUseCaseOutput>> {
    // Business logic to create a profile goes here
    // For example, check if email already exists, create profile entity, save to repository, etc.
    const name = ProfileName.create(input.name);
    if (name.isFailure) {
      return left(new InvalidProfileNameError(name.error));
    }

    const email = ProfileEmail.create(input.email);
    if (email.isFailure) {
      return left(new InvalidProfileEmailError(email.error));
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
