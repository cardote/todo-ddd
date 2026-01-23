import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';
import { InvalidTaskStatusError } from '../errors/invalid-task-status-error';

type AllowedTaskStatus = 'pending' | 'completed';
interface TaskStatusProps {
  value: AllowedTaskStatus;
}

export class TaskStatus extends ValueObject<TaskStatusProps> {
  get value(): AllowedTaskStatus {
    return this.props.value;
  }

  private constructor(props: TaskStatusProps) {
    super(props);
  }

  static create(status: string): Result<TaskStatus, InvalidTaskStatusError> {
    const normalized = (status ?? '').trim().toLowerCase();

    if (!normalized) {
      return Result.fail(
        new InvalidTaskStatusError('Task status cannot be empty'),
      );
    }

    const allowed: AllowedTaskStatus[] = ['pending', 'completed'];
    if (!allowed.includes(normalized as AllowedTaskStatus)) {
      return Result.fail(new InvalidTaskStatusError('status is not allowed'));
    }

    return Result.ok(
      new TaskStatus({ value: normalized as AllowedTaskStatus }),
    );
  }
}
