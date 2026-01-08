export class TaskAlreadyCompletedError extends Error {
  constructor(message = 'The task has already been completed') {
    super(message);
    this.name = 'TaskAlreadyCompletedError';
  }
}
