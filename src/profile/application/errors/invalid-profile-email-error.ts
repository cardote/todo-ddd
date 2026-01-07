export class InvalidProfileEmailError extends Error {
  constructor(message: string = 'Invalid profile email.') {
    super(message);
    this.name = 'InvalidProfileEmailError';
  }
}
