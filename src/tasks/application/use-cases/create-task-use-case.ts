import { TaskRepository } from '@/tasks/domain/repositories/task-repository';
import { ProfileReader } from '../services/profile-reader';
import { Either, left, right } from '@/shared/kernel/either';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { ProfileNotFoundError } from '../erros/profile-not-found-error';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';
import { InvalidTaskTitleError } from '../erros/invalid-task-title-error';
import { Task } from '@/tasks/domain/aggregates/task';

type CreateTaskInput = {
  ownerProfileId: string;
  title: string;
};

type CreateTaskOutput = {
  taskId: string;
};

export type CreateTaskError = ProfileNotFoundError | InvalidTaskTitleError;

export class CreateTaskUseCase {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly profileReader: ProfileReader,
  ) {}

  async execute(
    input: CreateTaskInput,
  ): Promise<Either<CreateTaskError, CreateTaskOutput>> {
    const ownerProfileId = new ProfileId(input.ownerProfileId);

    const profileExists = await this.profileReader.existsById(ownerProfileId);
    if (!profileExists) {
      return left(new ProfileNotFoundError());
    }

    const title = TaskTitle.create(input.title);
    if (title.isFailure) {
      return left(new InvalidTaskTitleError(title.error?.message));
    }

    const task = Task.create({
      title: title.value,
      ownerProfileId,
    });

    await this.tasks.save(task);

    return right({ taskId: task.id.value });
  }
}
