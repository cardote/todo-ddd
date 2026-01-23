import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { Either, left, right } from '@/shared/kernel/either';
import { ProfileNotFoundError } from '../../errors/profile-not-found-error';

type GetProfileUseCaseInput = {
  profileId: string;
};

type GetProfileUseCaseOutput = {
  profile: {
    id: string;
    name: string;
    email: string;
  };
};

export type GetProfileError = ProfileNotFoundError;
export class GetProfileUseCase {
  constructor(private readonly profiles: ProfileRepository) {}

  async execute(
    input: GetProfileUseCaseInput,
  ): Promise<Either<GetProfileError, GetProfileUseCaseOutput>> {
    const profile = await this.profiles.findById(
      new ProfileId(input.profileId),
    );

    if (!profile) {
      return left(new ProfileNotFoundError());
    }

    return right({
      profile: {
        id: profile.id.value,
        name: profile.name.value,
        email: profile.email.value,
      },
    });
  }
}
