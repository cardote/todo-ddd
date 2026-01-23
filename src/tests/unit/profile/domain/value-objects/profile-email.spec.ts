import { InvalidProfileEmailError } from '@/profile/domain/errors/invalid-profile-email-error';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';

describe('ProfileEmail (Unit)', () => {
  it('should return success result when email is valid', () => {
    const result = ProfileEmail.create('example@example.com');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it('should normalize the email (trim + lowercase)', () => {
    const result = ProfileEmail.create('  Example@example.com  ');
    expect(result.value.value).toBe('example@example.com');
  });

  it('should return failure when email is empty', () => {
    const result = ProfileEmail.create('');
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(InvalidProfileEmailError);
    expect(result.error?.message).toBe('Email is required');
  });

  it('should return failure when email is invalid format', () => {
    //missing "@" symbol, domain, username.
    const result = ProfileEmail.create('invalid-email');
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(InvalidProfileEmailError);
    expect(result.error?.message).toBe('Invalid email address');
  });
});
