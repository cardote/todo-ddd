export class ProfileNotFoundError extends Error {
  constructor(message: string = 'Profile not found.') {
    super(message);
    this.name = 'ProfileNotFoundError';
  }
}
