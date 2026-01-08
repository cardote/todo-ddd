import { CreateTaskUseCase } from '@/tasks/application/use-cases/create-task-use-case';
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
  });
});
