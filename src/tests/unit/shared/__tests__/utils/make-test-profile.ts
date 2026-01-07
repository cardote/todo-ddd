import { Profile } from '@/profile/domain/entities/profile';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { ProfileName } from '@/profile/domain/value-objects/profile-name';

const NAME = 'any-name';
const EMAIL = 'any-email@email.com';

export function makeTestProfile() {
  const createName = (name: string = NAME) => ProfileName.create(name).value;
  const createEmail = (email: string = EMAIL) =>
    ProfileEmail.create(email).value;
  const createProfile = (id?: ProfileId) => {
    return Profile.create({ name: createName(), email: createEmail() }, id);
  };

  return { createName, createEmail, createProfile };
}
