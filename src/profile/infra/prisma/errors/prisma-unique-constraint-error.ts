export class PrismaUniqueConstraintError extends Error {
  constructor(message = 'Unique constraint violation') {
    super(message);
    this.name = 'PrismaUniqueConstraintError';
  }
}
