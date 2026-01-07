import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';

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

  static create(status: string): Result<TaskStatus> {
    const normalized = (status ?? '').trim().toLowerCase();

    if (!normalized) {
      return Result.fail('Task status cannot be empty'); // make domain error later
    }

    const allowed: AllowedTaskStatus[] = ['pending', 'completed'];
    if (!allowed.includes(normalized as AllowedTaskStatus)) {
      return Result.fail('status is not allowed'); // make domain error later
    }

    return Result.ok(
      new TaskStatus({ value: normalized as AllowedTaskStatus }),
    );
  }
}
