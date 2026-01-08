export class InvalidTaskTitleError extends Error {
  constructor(message = 'Invalid task title') {
    super(message);
    this.name = 'InvalidTaskTitleError';
  }
}
