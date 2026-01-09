import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { Either, left, right } from '@/shared/kernel/either';
import { ProfileNotFoundError } from '../../errors/profile-not-found-error';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { InvalidProfileNameError } from '../../errors/invalid-profile-name-error';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { InvalidProfileEmailError } from '../../errors/invalid-profile-email-error';
import { EmailAlreadyInUseError } from '../../errors/email-already-in-use-error';

type UpdateProfileInput = {
  profileId: string;
  name?: string;
  email?: string;
};

type UpdateProfileOutput = {
  profileId: string;
};

export type UpdateProfileError =
  | ProfileNotFoundError
  | InvalidProfileNameError
  | InvalidProfileEmailError
  | EmailAlreadyInUseError;

export class UpdateProfileUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  async execute(
    input: UpdateProfileInput,
  ): Promise<Either<UpdateProfileError, UpdateProfileOutput>> {
    // Business logic to update a profile goes here
    const profileId = new ProfileId(input.profileId);

    const profile = await this.profiles.findById(profileId);
    if (!profile) {
      return left(new ProfileNotFoundError());
    }

    if (input.name) {
      const name = ProfileName.create(input.name);
      if (name.isFailure) {
        return left(new InvalidProfileNameError());
      }

      profile.changeName(name.value);
    }

    if (input.email) {
      const email = ProfileEmail.create(input.email);
      if (email.isFailure) {
        return left(new InvalidProfileEmailError());
      }

      // email must be unique
      const existingProfile = await this.profiles.findByEmail(email.value);
      if (existingProfile && existingProfile.id.value !== profile.id.value) {
        return left(new EmailAlreadyInUseError());
      }

      profile.changeEmail(email.value);
    }

    await this.profiles.save(profile);

    return right({ profileId: profile.id.value });
  }
}
