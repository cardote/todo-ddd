export class ProfileNotFoundError extends Error {
  constructor(message = 'Profile not found.') {
    super(message);
    this.name = 'ProfileNotFoundError';
  }
}
