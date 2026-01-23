import { DomainError } from '@/shared/kernel/result';

export class TaskAlreadyCompletedError extends DomainError {
  constructor(message = 'The task has already been completed') {
    super(message);
  }
}
