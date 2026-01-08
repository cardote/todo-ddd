import { ProfileId } from '@/profile/domain/value-objects/profile-id';

export interface ProfileReader {
  existsById(profileId: ProfileId): Promise<boolean>;
}
