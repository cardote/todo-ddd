import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { TaskTitle } from '../value-objects/task-title';
import { TaskStatus } from '../value-objects/task-status';
import { AggregateRoot } from '@/shared/kernel/aggregate-root';
import { Result } from '@/shared/kernel/result';
import { TaskAlreadyCompletedError } from '../errors/task-already-completed-error';
import { TaskId } from '../value-objects/task-id';

export interface TaskProps {
  title: TaskTitle;
  ownerProfileId: ProfileId;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
}

export type CreateTaskProps = {
  title: TaskTitle;
  ownerProfileId: ProfileId;
  createdAt?: Date;
};

export type RehydrateTaskProps = {
  title: TaskTitle;
  ownerProfileId: ProfileId;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
};

export class Task extends AggregateRoot<TaskProps> {
  get title() {
    return this.props.title;
  }

  get ownerProfileId() {
    return this.props.ownerProfileId;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get completedAt() {
    return this.props.completedAt;
  }

  private constructor(props: TaskProps, id?: TaskId) {
    super(props, id);
  }

  static create(props: CreateTaskProps, id?: TaskId): Task {
    const now = new Date();
    return new Task(
      {
        ...props,
        status: TaskStatus.create('pending').value,
        createdAt: props.createdAt ?? now,
      },
      id,
    );
  }

  static rehydrate(props: RehydrateTaskProps, id: TaskId): Task {
    return new Task(
      {
        ...props,
      },
      id,
    );
  }

  complete(): Result<void, TaskAlreadyCompletedError> {
    if (this.status.value === 'completed') {
      return Result.fail(new TaskAlreadyCompletedError());
    }

    this.props.status = TaskStatus.create('completed').value;
    this.props.completedAt = new Date();

    return Result.ok<void>();
  }
}
