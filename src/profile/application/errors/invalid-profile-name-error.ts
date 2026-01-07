export class InvalidProfileNameError extends Error {
  constructor(message: string = 'Invalid profile name.') {
    super(message);
    this.name = 'InvalidProfileNameError';
  }
}
