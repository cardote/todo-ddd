import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { Task } from '@/tasks/domain/aggregates/task';
import { TaskAlreadyCompletedError } from '@/tasks/domain/errors/task-already-completed-error';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';

describe('Task (Unit)', () => {
  it('should create a task with default status pending', () => {
    const title = TaskTitle.create('Learn DDD').value;
    const ownerProfileId = new ProfileId();

    const task = Task.create({
      title,
      ownerProfileId,
    });

    expect(task.title.value).toBe('Learn DDD');
    expect(task.ownerProfileId).toBe(ownerProfileId);
    expect(task.status.value).toBe('pending');
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.completedAt).toBeUndefined();
  });

  it('should complete a pending task', () => {
    const title = TaskTitle.create('Learn DDD').value;
    const ownerProfileId = new ProfileId();

    const task = Task.create({
      title,
      ownerProfileId,
    });

    const result = task.complete();

    expect(result.isSuccess).toBe(true);
    expect(task.status.value).toBe('completed');
    expect(task.completedAt).toBeInstanceOf(Date);
  });

  it('should not complete an already completed task', () => {
    const title = TaskTitle.create('Learn DDD').value;
    const ownerProfileId = new ProfileId();

    const task = Task.create({
      title,
      ownerProfileId,
    });

    task.complete();

    const result = task.complete();

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(TaskAlreadyCompletedError);
  });
});
