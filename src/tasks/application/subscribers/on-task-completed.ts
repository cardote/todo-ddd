import { domainEvents } from '@/shared/infra/events/domain-event-dispatcher';
import { TaskCompletedEvent } from '@/tasks/domain/events/task-completed-event';

domainEvents.register('TaskCompletedEvent', async event => {
  const e = event as TaskCompletedEvent;

  console.log(
    `Event -> Task completed: ${e.taskId.value} by ${e.ownerProfileId.value}`,
  );
});
