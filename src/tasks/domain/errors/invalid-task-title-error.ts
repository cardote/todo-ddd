import { DomainError } from '@/shared/kernel/result';

export class InvalidTaskTitleError extends DomainError {
  constructor(message = 'Invalid task title') {
    super(message);
  }
}
