import { DomainEvent } from '@/shared/kernel/domain-event';
import { ProfileId } from '../value-objects/profile-id';
import { TaskId } from '../value-objects/task-id';

export class TaskCompletedEvent implements DomainEvent {
  public readonly occuredAt = new Date();
  public readonly name = 'TaskCompletedEvent';

  constructor(
    public readonly taskId: TaskId,
    public readonly ownerProfileId: ProfileId,
    ocurredAt?: Date,
  ) {
    this.occuredAt = ocurredAt ?? new Date();
  }
}
