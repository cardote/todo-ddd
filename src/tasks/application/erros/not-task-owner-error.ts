export class NotTaskOwnerError extends Error {
  constructor(message = 'Only the task owner can perform this action') {
    super(message);
    this.name = 'NotTaskOwnerError';
  }
}
