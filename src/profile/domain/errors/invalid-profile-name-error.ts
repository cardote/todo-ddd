import { DomainError } from '@/shared/kernel/result';

export class InvalidProfileNameError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
