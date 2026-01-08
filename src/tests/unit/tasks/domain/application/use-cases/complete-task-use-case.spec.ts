import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { NotTaskOwnerError } from '@/tasks/application/erros/not-task-owner-error';
import { TaskAlreadyCompletedError } from '@/tasks/application/erros/task-already-completed-error';
import { TaskNotFoundError } from '@/tasks/application/erros/task-not-found-error';
import { CompleteTaskUseCase } from '@/tasks/application/use-cases/complete-task-use-case';
import { Task } from '@/tasks/domain/aggregates/task';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';
import { InMemoryTaskRepository } from '@/tasks/infra/repositories/in-memory-task-repository';

describe('CompleteTaskUseCase (Unit)', () => {
  it('should allow task completion by the owner', async () => {
    const repo = new InMemoryTaskRepository();
    const useCase = new CompleteTaskUseCase(repo);

    const ownerProfileId = new ProfileId('any-owner-id');
    const task = Task.create({
      ownerProfileId,
      title: TaskTitle.create('Any Task').value,
    });
    await repo.save(task);

    const result = await useCase.execute({
      taskId: task.id.value,
      requesterProfileId: ownerProfileId.value,
    });

    expect(result.isRight()).toBe(true);

    const completedTask = await repo.findById(task.id.value);
    expect(completedTask?.status.value).toBe('completed');
    expect(completedTask?.completedAt).toBeInstanceOf(Date);
  });

  it('should not allow task completion by a non-owner', async () => {
    const repo = new InMemoryTaskRepository();
    const useCase = new CompleteTaskUseCase(repo);

    const ownerProfileId = new ProfileId('any-owner-id');
    const task = Task.create({
      ownerProfileId,
      title: TaskTitle.create('Any Task').value,
    });
    await repo.save(task);

    const result = await useCase.execute({
      taskId: task.id.value,
      requesterProfileId: 'any-non-owner-id',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotTaskOwnerError);
      expect(result.value.message).toBe(
        'Only the task owner can perform this action',
      );
    }
  });

  it('should not allow completing an already completed task', async () => {
    const repo = new InMemoryTaskRepository();
    const useCase = new CompleteTaskUseCase(repo);

    const ownerProfileId = new ProfileId('any-owner-id');
    const task = Task.create({
      ownerProfileId,
      title: TaskTitle.create('Any Task').value,
    });
    await repo.save(task);

    await useCase.execute({
      taskId: task.id.value,
      requesterProfileId: ownerProfileId.value,
    });

    const result = await useCase.execute({
      taskId: task.id.value,
      requesterProfileId: ownerProfileId.value,
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(TaskAlreadyCompletedError);
      expect(result.value.message).toBe('Task is already completed');
    }
  });

  it('should return error if task not found', async () => {
    const repo = new InMemoryTaskRepository();
    const useCase = new CompleteTaskUseCase(repo);

    const result = await useCase.execute({
      taskId: 'non-existing-task-id',
      requesterProfileId: 'any-profile-id',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(TaskNotFoundError);
      expect(result.value.message).toBe('Task not found');
    }
  });
});
