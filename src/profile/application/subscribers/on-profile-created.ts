import { ProfileCreatedEvent } from '@/profile/domain/events/profile-created-event';
import { domainEvents } from '@/shared/infra/events/domain-event-dispatcher';

domainEvents.register('ProfileCreatedEvent', async event => {
  const e = event as ProfileCreatedEvent;

  // placeholder: make notification later

  console.log(`Event -> Profile created: ${e.profileId.value}`);
});
