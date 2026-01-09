import { Profile } from '@/profile/domain/entities/profile';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { DomainError, Result } from '@/shared/kernel/result';

export type PrismaProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

export class CorruptedProfileRecordError extends DomainError {
  constructor(message = 'Corrupted profile record') {
    super(message);
  }
}

export class PrismaProfileMapper {
  static toPrisma(profile: Profile): PrismaProfile {
    return {
      id: profile.id.value,
      name: profile.name.value,
      email: profile.email.value,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  static toDomain(
    raw: PrismaProfile,
  ): Result<Profile, CorruptedProfileRecordError> {
    const id = new ProfileId(raw.id);

    const name = ProfileName.create(raw.name);
    if (name.isFailure) {
      return Result.fail(
        new CorruptedProfileRecordError(
          `Invalid profile name in record with ID ${raw.id}`,
        ),
      );
    }

    const email = ProfileEmail.create(raw.email);
    if (email.isFailure) {
      return Result.fail(
        new CorruptedProfileRecordError(
          `Invalid profile email in record with ID ${raw.id}`,
        ),
      );
    }

    const profile = Profile.create(
      {
        name: name.value,
        email: email.value,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      id,
    );

    return Result.ok(profile);
  }
}
