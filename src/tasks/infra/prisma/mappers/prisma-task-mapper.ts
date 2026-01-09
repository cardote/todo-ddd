import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { DomainError, Result } from '@/shared/kernel/result';
import { Task } from '@/tasks/domain/aggregates/task';
import { TaskId } from '@/tasks/domain/value-objects/task-id';
import { TaskStatus } from '@/tasks/domain/value-objects/task-status';
import { TaskTitle } from '@/tasks/domain/value-objects/task-title';

export type PrismaTask = {
  id: string;
  title: string;
  status: string;
  ownerProfileId: string;
  createdAt: Date | undefined;
  completedAt: Date | null;
};

export class CorruptedTaskRecordError extends DomainError {
  constructor(message = 'Corrupted task record') {
    super(message);
  }
}

export class PrismaTaskMapper {
  static toPrisma(task: Task): PrismaTask {
    return {
      id: task.id.value,
      title: task.title.value,
      status: task.status.value,
      ownerProfileId: task.ownerProfileId.value,
      createdAt: task.createdAt,
      completedAt: task.completedAt ?? null,
    };
  }

  static toDomain(raw: PrismaTask): Result<Task, CorruptedTaskRecordError> {
    const id = new TaskId(raw.id);

    const title = TaskTitle.create(raw.title);
    if (title.isFailure) {
      return Result.fail(
        new CorruptedTaskRecordError(
          `Invalid task title in record with ID ${raw.id}`,
        ),
      );
    }

    const status = TaskStatus.create(raw.status);
    if (status.isFailure) {
      return Result.fail(
        new CorruptedTaskRecordError(
          `Invalid task status in record with ID ${raw.id}`,
        ),
      );
    }

    const ownerProfileId = new ProfileId(raw.ownerProfileId);

    const task = Task.rehydrate(
      {
        title: title.value,
        ownerProfileId,
        status: status.value,
        createdAt: raw.createdAt ?? new Date(),
        completedAt: raw.completedAt ?? undefined,
      },
      id,
    );

    return Result.ok(task);
  }
}
