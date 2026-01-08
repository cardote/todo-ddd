import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';
import { InvalidTaskTitleError } from '../errors/invalid-task-title-error';

interface TaskTitleProps {
  value: string;
}

export class TaskTitle extends ValueObject<TaskTitleProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: TaskTitleProps) {
    super(props);
  }

  static create(title: string): Result<TaskTitle, InvalidTaskTitleError> {
    const normalized = (title ?? '').trim();

    if (!normalized) {
      return Result.fail(
        new InvalidTaskTitleError('Task title cannot be empty'),
      );
    }

    if (normalized.length < 3) {
      return Result.fail(
        new InvalidTaskTitleError(
          'Task title must be at least 3 characters long',
        ),
      );
    }

    if (normalized.length > 120) {
      return Result.fail(
        new InvalidTaskTitleError(
          'Task title must have at most 120 characters long',
        ),
      );
    }

    return Result.ok(new TaskTitle({ value: normalized }));
  }
}
