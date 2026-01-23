import { DomainError } from '@/shared/kernel/result';

export class InvalidProfileEmailError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
