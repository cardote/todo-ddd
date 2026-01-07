import { TaskStatus } from '@/tasks/domain/value-objects/task-status';

describe('TaskStatus (Unit)', () => {
  it('should create a valid status (pending)', () => {
    const result = TaskStatus.create('pending');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.value.value).toBe('pending');
  });

  it('should create a valid status (completed)', () => {
    const result = TaskStatus.create('completed');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.value.value).toBe('completed');
  });

  it('should normalize the status (trim + lowercase)', () => {
    const result = TaskStatus.create('  COMPLETED  ');

    expect(result.isSuccess).toBe(true);
    expect(result.value.value).toBe('completed');
  });

  it('should return failure when status is empty', () => {
    const result = TaskStatus.create('');

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return failure when status is not allowed', () => {
    const result = TaskStatus.create('in-progress');

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
  });
});
