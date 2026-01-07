import { Result } from '@/shared/kernel/result';
import { ValueObject } from '@/shared/kernel/value-object';

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

  static create(title: string): Result<TaskTitle> {
    const normalized = (title ?? '').trim();

    if (!normalized) {
      return Result.fail('Task title cannot be empty'); // make domain error later
    }

    if (normalized.length < 3) {
      return Result.fail('Task title must be at least 3 characters long'); // make domain error later
    }

    if (normalized.length > 120) {
      return Result.fail('Task title must have at most 120 characters long'); // make domain error later
    }

    return Result.ok(new TaskTitle({ value: normalized }));
  }
}
