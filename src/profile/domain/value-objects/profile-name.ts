import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';
import { InvalidProfileNameError } from '../errors/invalid-profile-name-error';

interface ProfileNameProps {
  value: string;
}

export class ProfileName extends ValueObject<ProfileNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProfileNameProps) {
    super(props);
  }

  static create(name: string): Result<ProfileName> {
    // Define domain validation rules for profile name
    const normalizedName = (
      name.charAt(0).toUpperCase() + name.slice(1)
    ).trim();

    if (normalizedName.length < 3) {
      return Result.fail(
        new InvalidProfileNameError(
          'Profile name must be at least 3 characters long',
        ),
      );
    }
    if (normalizedName.length > 60) {
      return Result.fail(
        new InvalidProfileNameError(
          'Profile name must have at most 60 characters long',
        ),
      );
    }

    return Result.ok(new ProfileName({ value: normalizedName }));
  }
}
