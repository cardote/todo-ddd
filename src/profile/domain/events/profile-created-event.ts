import { DomainEvent } from '@/shared/kernel/domain-event';
import { ProfileId } from '../value-objects/profile-id';
import { ProfileEmail } from '../value-objects/profile-email';

export class ProfileCreatedEvent implements DomainEvent {
  public readonly occuredAt = new Date();
  public readonly name = 'ProfileCreatedEvent';

  constructor(
    public readonly profileId: ProfileId,
    public readonly email: ProfileEmail,
    ocurredAt?: Date,
  ) {
    this.occuredAt = ocurredAt ?? new Date();
  }
}
