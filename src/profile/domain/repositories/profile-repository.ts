import { Profile } from '../entities/profile';
import { ProfileEmail } from '../value-objects/profile-email';
import { ProfileId } from '../value-objects/profile-id';

export interface ProfileRepository {
  findById(id: ProfileId): Promise<Profile | null>;
  findByEmail(email: ProfileEmail): Promise<Profile | null>;
  save(profile: Profile): Promise<Profile>;
}
