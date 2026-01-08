import { Either, left, right } from '@/shared/kernel/either';
import { TaskRepository } from '@/tasks/domain/repositories/task-repository';
import { TaskNotFoundError } from '../erros/task-not-found-error';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { NotTaskOwnerError } from '../erros/not-task-owner-error';
import { TaskAlreadyCompletedError } from '../erros/task-already-completed-error';

type CompleteTaskInput = {
  taskId: string;
  requesterProfileId: string;
};

type CompleteTaskOutput = {
  taskId: string;
};

export class CompleteTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(
    input: CompleteTaskInput,
  ): Promise<Either<Error, CompleteTaskOutput>> {
    const task = await this.tasks.findById(input.taskId);

    if (!task) {
      return left(new TaskNotFoundError());
    }

    const requesterProfileId = new ProfileId(input.requesterProfileId);

    if (task.ownerProfileId.value !== requesterProfileId.value) {
      return left(new NotTaskOwnerError());
    }

    const result = task.complete();

    if (result.isFailure) {
      return left(new TaskAlreadyCompletedError(result.error));
    }

    await this.tasks.save(task);

    return right({ taskId: task.id.value });
  }
}
