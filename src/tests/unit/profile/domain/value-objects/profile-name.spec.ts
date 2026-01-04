import { ProfileName } from '@/profile/domain/value-objects/profile-name';

describe('ProfileName (Unit)', () => {
  it('should return success result when name is valid', () => {
    const result = ProfileName.create('John');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it('should capitalize first letter', () => {
    const result = ProfileName.create('john');
    expect(result.value.value).toBe('John');
  });

  it('should trim whitespace from name', () => {
    const result = ProfileName.create('  Alice  ');
    expect(result.value.value).toBe('Alice');
  });

  it('should return failure result when name is too short', () => {
    const result = ProfileName.create('Ed');
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(
      'Profile name must be at least 3 characters long',
    );
  });

  it('should return failure result when name is too long', () => {
    const longName = 'A'.repeat(61);
    const result = ProfileName.create(longName);
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(
      'Profile name must have at most 60 characters long',
    );
  });
});
