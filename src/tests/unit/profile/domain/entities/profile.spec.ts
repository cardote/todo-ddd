import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';
import { Profile } from '@/profile/domain/entities/profile';

const INITIAL_DATE = new Date('2026-01-01T00:00:00Z');
const NEXT_DATE = new Date('2026-01-01T01:00:00Z');
const makeProfile = () => {
  const name = ProfileName.create('any-name').value;
  const email = ProfileEmail.create('any-email@email.com').value;

  return Profile.create({ name, email });
};
describe('Profile Entity (Unit)', () => {
  it('should set createdAt and updatedAt when not provided', () => {
    const profile = makeProfile();

    expect(profile.createdAt).toBeInstanceOf(Date);
    expect(profile.updatedAt).toBeInstanceOf(Date);
  });

  it('should update updatedAt when change email', () => {
    vi.useFakeTimers();
    vi.setSystemTime(INITIAL_DATE);

    const profile = makeProfile();
    const previousUpdatedAt = profile.updatedAt;

    vi.setSystemTime(NEXT_DATE);

    const newEmail = ProfileEmail.create('new-email@email.com').value;

    profile.changeEmail(newEmail);

    expect(profile.email.value).toBe('new-email@email.com');
    expect(profile.updatedAt!.getTime()).toBeGreaterThan(
      previousUpdatedAt!.getTime(),
    );
  });

  it('should update updatedAt when change name', () => {
    vi.useFakeTimers();
    vi.setSystemTime(INITIAL_DATE);

    const profile = makeProfile();
    const previousUpdatedAt = profile.updatedAt;

    vi.setSystemTime(NEXT_DATE);

    const newName = ProfileName.create('new-name').value;

    profile.changeName(newName);

    expect(profile.name.value).toBe('New-name');
    expect(profile.updatedAt!.getTime()).toBeGreaterThan(
      previousUpdatedAt!.getTime(),
    );
  });
});
