import { InvalidTaskTitleError } from '@/tasks/application/erros/invalid-task-title-error';
import { ProfileNotFoundError } from '@/tasks/application/erros/profile-not-found-error';
import { CreateTaskUseCase } from '@/tasks/application/use-cases/create-task/create-task-use-case';
import { TaskId } from '@/tasks/domain/value-objects/task-id';
import { InMemoryTaskRepository } from '@/tasks/infra/repositories/in-memory-task-repository';

class FakeProfileReader {
  constructor(private readonly existingIds: Set<string>) {}

  async existsById(profileId: any): Promise<boolean> {
    return this.existingIds.has(profileId.value);
  }
}

describe('CreateTaskUseCase (Unit)', () => {
  it('should create a task successfully', async () => {
    const repo = new InMemoryTaskRepository();
    const profileReader = new FakeProfileReader(new Set(['any-profile-id']));
    const useCase = new CreateTaskUseCase(repo, profileReader);

    const result = await useCase.execute({
      ownerProfileId: 'any-profile-id',
      title: 'Any Task',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.taskId).toBeDefined();

      const task = await repo.findById(new TaskId(result.value.taskId));
      expect(task).not.toBeNull();
      expect(task?.title.value).toBe('Any Task');
      expect(task?.ownerProfileId.value).toBe('any-profile-id');
      expect(task?.status.value).toBe('pending');
    }
  });

  it('should return error if profile does not exist', async () => {
    const repo = new InMemoryTaskRepository();
    const profileReader = new FakeProfileReader(new Set([]));
    const useCase = new CreateTaskUseCase(repo, profileReader);

    const result = await useCase.execute({
      ownerProfileId: 'non-existing-profile-id',
      title: 'Any Task',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProfileNotFoundError);
      expect(result.value.message).toBe('Profile not found.');
    }
  });

  it('should return error if task title is invalid', async () => {
    const repo = new InMemoryTaskRepository();
    const profileReader = new FakeProfileReader(new Set(['any-profile-id']));
    const useCase = new CreateTaskUseCase(repo, profileReader);

    const result = await useCase.execute({
      ownerProfileId: 'any-profile-id',
      title: '',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidTaskTitleError);
      expect(result.value.message).toBe('Task title cannot be empty');
    }
  });
});
