import { makeTestProfile } from '@/shared/__tests__/utils/make-test-profile';

const INITIAL_DATE = new Date('2026-01-01T00:00:00Z');
const NEXT_DATE = new Date('2026-01-01T01:00:00Z');

describe('Profile Entity (Unit)', () => {
  it('should set createdAt and updatedAt when not provided', () => {
    const profile = makeTestProfile().createProfile();

    expect(profile.createdAt).toBeInstanceOf(Date);
    expect(profile.updatedAt).toBeInstanceOf(Date);
  });

  it('should update updatedAt when change email', () => {
    vi.useFakeTimers();
    vi.setSystemTime(INITIAL_DATE);

    const { createProfile, createEmail } = makeTestProfile();
    const profile = createProfile();
    const previousUpdatedAt = profile.updatedAt;

    vi.setSystemTime(NEXT_DATE);

    const newEmail = createEmail('new-email@email.com');

    profile.changeEmail(newEmail);

    expect(profile.email.value).toBe('new-email@email.com');
    expect(profile.updatedAt!.getTime()).toBeGreaterThan(
      previousUpdatedAt!.getTime(),
    );
  });

  it('should update updatedAt when change name', () => {
    vi.useFakeTimers();
    vi.setSystemTime(INITIAL_DATE);

    const { createProfile, createName } = makeTestProfile();
    const profile = createProfile();
    const previousUpdatedAt = profile.updatedAt;

    vi.setSystemTime(NEXT_DATE);

    const newName = createName('new-name');

    profile.changeName(newName);

    expect(profile.name.value).toBe('New-name');
    expect(profile.updatedAt!.getTime()).toBeGreaterThan(
      previousUpdatedAt!.getTime(),
    );
  });
});
