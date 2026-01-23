import { Profile } from '@/profile/domain/entities/profile';
import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';

export class InMemoryProfileRepository implements ProfileRepository {
  private profiles = new Map<string, Profile>();
  private emailIndex = new Map<string, string>(); // email -> profileId
  private emailById = new Map<string, string>(); // profileId -> last saved email
  async findById(id: ProfileId): Promise<Profile | null> {
    return this.profiles.get(id.value) || null;
  }
  async findByEmail(email: ProfileEmail): Promise<Profile | null> {
    const profileId = this.emailIndex.get(email.value);

    if (!profileId) return null;

    return this.profiles.get(profileId) || null;
  }
  async save(profile: Profile): Promise<Profile> {
    const id = profile.id.value;
    const currentEmail = profile.email.value;
    const previousEmail = this.emailById.get(id);

    if (previousEmail && previousEmail !== currentEmail) {
      const indexedId = this.emailIndex.get(previousEmail);
      if (indexedId === id) {
        this.emailIndex.delete(previousEmail);
      }
    }
    // Upsert profile
    this.profiles.set(id, profile);

    // update email index
    this.emailIndex.set(currentEmail, id);
    this.emailById.set(id, currentEmail);

    return profile;
  }
}
