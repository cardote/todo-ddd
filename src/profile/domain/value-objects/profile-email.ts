import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';
import { InvalidProfileEmailError } from '../errors/invalid-profile-email-error';

interface ProfileEmailProps {
  value: string;
}

export class ProfileEmail extends ValueObject<ProfileEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ProfileEmailProps) {
    super(props);
  }

  static create(email: string): Result<ProfileEmail> {
    // Define domain validation rules for profile email

    const normalized = (email ?? '').trim().toLowerCase();

    if (!normalized) {
      return Result.fail(new InvalidProfileEmailError('Email is required'));
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    if (!isValid) {
      return Result.fail(new InvalidProfileEmailError('Invalid email address'));
    }
    return Result.ok(new ProfileEmail({ value: normalized }));
  }
}
