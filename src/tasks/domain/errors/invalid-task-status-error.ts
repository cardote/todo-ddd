import { DomainError } from '@/shared/kernel/result';

export class InvalidTaskStatusError extends DomainError {
  constructor(message = 'Invalid task status') {
    super(message);
  }
}
