import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { Task } from '@/tasks/domain/aggregates/task';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';

describe('Task (Unit)', () => {
  it('should create a task with default status pending', () => {
    const title = TaskTitle.create('Learn DDD').value;
    const ownerProfileId = new ProfileId();

    const task = Task.create({
      title,
      ownerProfileId,
    });
  });
});
